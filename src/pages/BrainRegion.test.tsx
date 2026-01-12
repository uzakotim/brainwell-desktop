// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BrainRegion from './BrainRegion';
import { questions } from '../data/Questions';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

describe('BrainRegion Component', () => {
  it('renders 5 random questions valid for the specific region (PFC)', async () => {
    const regionName = 'PFC';
    const regionData = questions.brain_checkup[regionName];
    
    render(
      <MemoryRouter initialEntries={[`/brain-region/${regionName}`]}>
        <Routes>
          <Route path="/brain-region/:region" element={<BrainRegion />} />
        </Routes>
      </MemoryRouter>
    );

    // 1. Verify Header contains the region name
    const header = await screen.findByRole('heading', { level: 1 });
    expect(header.textContent).toBe(regionName);

    // 2. Verify Description
    expect(screen.getByText(regionData.description)).toBeInTheDocument();

    // 3. Verify exactly 5 questions are displayed
    // In BrainRegion.tsx, questions are rendered inside h3 tags
    // We can assume the questions are the text content of these h3s, possibly prefixed with "Index. "
    const questionHeadings = await screen.findAllByRole('heading', { level: 3 });
    expect(questionHeadings).toHaveLength(5);

    // 4. Verify that each displayed question belongs to the PFC source list
    questionHeadings.forEach((heading) => {
      // The component renders: "{index + 1}. {question}"
      // We need to strip the number prefix to match against the source data
      const displayedText = heading.textContent || '';
      // Regex to remove "1. ", "2. ", etc.
      const questionText = displayedText.replace(/^\d+\.\s/, '');
      
      expect(regionData.questions).toContain(questionText);
    });

    console.log(`Verified BrainRegion for ${regionName}: Displayed correct region info and 5 valid questions.`);
  });

  it('renders 5 random questions valid for another region (Amygdala)', async () => {
    const regionName = 'Amygdala';
    const regionData = questions.brain_checkup[regionName];
    
    render(
      <MemoryRouter initialEntries={[`/brain-region/${regionName}`]}>
        <Routes>
          <Route path="/brain-region/:region" element={<BrainRegion />} />
        </Routes>
      </MemoryRouter>
    );

    const header = await screen.findByRole('heading', { level: 1 });
    expect(header.textContent).toBe(regionName);

    const questionHeadings = await screen.findAllByRole('heading', { level: 3 });
    expect(questionHeadings).toHaveLength(5);

    questionHeadings.forEach((heading) => {
        const displayedText = heading.textContent || '';
        const questionText = displayedText.replace(/^\d+\.\s/, '');
        expect(regionData.questions).toContain(questionText);
    });
  });
});
