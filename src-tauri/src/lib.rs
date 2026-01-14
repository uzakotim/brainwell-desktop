// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use serde_json::{Value, json};
pub fn init_icloud_store() -> Result<String, String> {
    let home = std::env::var("HOME")
        .map_err(|_| "HOME not set")?;

    let icloud_dir = PathBuf::from(&home)
        .join("Library")
        .join("Mobile Documents")
        .join("com~apple~CloudDocs")
        .join("Brainwell");

    // Try to access iCloud directory
    match fs::create_dir_all(&icloud_dir) {
        Ok(_) => {
            let store_path = icloud_dir.join("store.json");
            // Verify access by checking existence or creating
            let accessible = if store_path.exists() {
                fs::File::open(&store_path).is_ok()
            } else {
                fs::File::create(&store_path)
                    .and_then(|mut f| f.write_all(b"{\n  \"records\": []\n}"))
                    .is_ok()
            };

            if accessible {
                return Ok(store_path.to_string_lossy().to_string());
            }
        }
        Err(e) => {
            println!("iCloud access check failed: {}", e);
        }
    }

    // Fallback to local storage if iCloud is not accessible
    println!("Warning: iCloud storage not accessible. To enable iCloud sync, grant 'Full Disk Access' to your terminal application in System Settings > Privacy & Security. Falling back to local storage: ~/.architect_desktop");
    let local_dir = PathBuf::from(&home).join(".brainwell");
    fs::create_dir_all(&local_dir).map_err(|e| e.to_string())?;

    let store_path = local_dir.join("store.json");
    if !store_path.exists() {
        let mut file = fs::File::create(&store_path)
            .map_err(|e| e.to_string())?;
        file.write_all(b"{\n  \"records\": []\n}")
            .map_err(|e| e.to_string())?;
    }

    Ok(store_path.to_string_lossy().to_string())
}

#[tauri::command]
fn update_store(store_json: String) -> Result<(), String> {
    let store_path = init_icloud_store()?;

    let mut file = fs::File::create(&store_path)
        .map_err(|e| e.to_string())?;

    file.write_all(store_json.as_bytes())
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn insert_record_to_store(record_json: String) -> Result<(), String> {
    let store_path = init_icloud_store()?;

    // Read existing store
    let store_content = fs::read_to_string(&store_path)
        .unwrap_or_else(|_| "{ \"records\": [] }".to_string());

    // Parse store JSON
    let mut store_value: Value = serde_json::from_str(&store_content)
        .unwrap_or_else(|_| json!({ "records": [] }));

    // Parse incoming record
    let record_value: Value = serde_json::from_str(&record_json)
        .map_err(|e| format!("Invalid record JSON: {}", e))?;

    // Ensure records array exists
    let records = store_value
        .get_mut("records")
        .and_then(|v| v.as_array_mut())
        .ok_or("Store format invalid: 'records' must be an array")?;

    // Insert new record
    records.push(record_value);

    // Write updated store back to disk
    fs::write(
        &store_path,
        serde_json::to_string_pretty(&store_value)
            .map_err(|e| e.to_string())?
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn load_store() -> Result<String, String> {
    let store_path = init_icloud_store()?;

    let content = fs::read_to_string(&store_path)
        .map_err(|e| e.to_string())?;

    Ok(content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = fix_path_env::fix();
    dotenv::dotenv().ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
         .setup(|_app| {
             #[cfg(target_os = "macos")]
            _app.set_activation_policy(tauri::ActivationPolicy::Regular);
            let _ = init_icloud_store();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![load_store,insert_record_to_store,update_store])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
