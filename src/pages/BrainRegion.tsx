import { useParams, Link } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import Layout from '@/components/Layout';
import { questions } from '../data/Questions';
import { brainRegionAnswersAtom, brainRegionQuestionsAtom } from '../store/brainCheckupStore';

const BrainRegion = () => {
  const { region } = useParams<{ region: string }>();

  // Find the key in questions.brain_checkup that matches the region param (case-insensitive)
  const regionKey = Object.keys(questions.brain_checkup).find(
    (key) => key.toLowerCase() === region?.toLowerCase()
  ) as keyof typeof questions.brain_checkup | undefined;

  const regionData = regionKey ? questions.brain_checkup[regionKey] : null;

  // Use the global state for questions instead of local random shuffling
  const allQuestions = useAtomValue(brainRegionQuestionsAtom);
  const [allAnswers, setAllAnswers] = useAtom(brainRegionAnswersAtom);

  const regionQuestions = regionKey ? allQuestions[regionKey] : [];
  const regionAnswers = regionKey && allAnswers[regionKey] ? allAnswers[regionKey] : [0, 0, 0, 0, 0];

  const handleAnswer = (index: number, value: number) => {
    if (!regionKey) return;

    // Create a deep copy of the answers object to ensure Jotai updates triggered correcty
    const newAllAnswers = { ...allAnswers };
    const newRegionAnswers = [...(newAllAnswers[regionKey] || [0, 0, 0, 0, 0])];
    newRegionAnswers[index] = value;
    newAllAnswers[regionKey] = newRegionAnswers;

    setAllAnswers(newAllAnswers);
  };

  if (!regionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Region not found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the region you're looking for.</p>
          <Link to="/brain-map" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Return to Brain Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center">

        <header className="mb-12">
          <p className="text-xl text-muted-foreground leading-relaxed">
            {regionData.description}
          </p>
        </header>

        <div className="space-y-8">
          {regionQuestions.length > 0 ? (
            regionQuestions.map((q, index) => (
              <QuestionCard
                key={`${regionKey}-${index}-${q}`}
                question={q}
                index={index}
                currentAnswer={regionAnswers[index]}
                onAnswer={(val) => handleAnswer(index, val)}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground p-8">
              No questions available. Please return to the map and click "Randomize questions".
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

const QuestionCard = ({
  question,
  index,
  currentAnswer,
  onAnswer
}: {
  question: string;
  index: number;
  currentAnswer: number;
  onAnswer: (val: number) => void;
}) => {
  const options = [
    { label: 'No', value: 0 },
    { label: 'Sometimes', value: 1 },
    { label: 'Yes', value: 2 },
  ];

  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-card px-4 py-4 transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:justify-between md:gap-6 md:px-5">
      <h3 className="min-w-0 flex-1 text-base font-medium leading-snug text-card-foreground">
        <span className="mr-2 text-muted-foreground">{index + 1}.</span>
        {question}
      </h3>

      <div className="grid shrink-0 grid-cols-3 gap-1 rounded-lg bg-secondary/50 p-1">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => onAnswer(option.value)}
            className={`
          rounded-md px-3 py-2 text-sm font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
          cursor-pointer
          ${currentAnswer === option.value
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
              }
        `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrainRegion;
