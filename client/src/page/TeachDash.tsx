"use client"
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import colors from 'tailwindcss/colors';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

// --- 1. FAKE DATA GENERATION (Unchanged) ---

const lessons = [
  { id: 1, name: 'Algebra', category: 'Mathematics' },
  { id: 2, name: 'Physics: Laws of Motion', category: 'Science' },
  { id: 3, name: 'Creative Writing 101', category: 'Arts & Humanities' },
  { id: 4, name: 'Web Development Basics', category: 'Technology' },
  { id: 5, name: 'Data Structures in Python', category: 'Technology' },
  { id: 6, name: 'History of Ancient Rome', category: 'Arts & Humanities' },
  { id: 7, name: 'Chemistry Fundamentals', category: 'Science' },
];

const enrollments = Array.from({ length: 500 }, () => {
    const lesson = faker.helpers.arrayElement(lessons);
    const completionRate = faker.number.int({ min: 20, max: 100 });
    const finalScore = Math.min(100, completionRate - 10 + faker.number.int({ min: 0, max: 25 }));
    
    return {
        lessonId: lesson.id,
        lessonCategory: lesson.category,
        completionRate, // ENGAGEMENT
        finalScore,     // PERFORMANCE
    };
});


// --- 2. DATA AGGREGATION (Updated for new chart) ---

// A. Aggregate Enrollments by Category (Unchanged)
const enrollmentsByCategory = enrollments.reduce((acc, enrollment) => {
  acc[enrollment.lessonCategory] = (acc[enrollment.lessonCategory] || 0) + 1;
  return acc;
}, {} as Record<string, number>);


// B. Aggregate Engagement Distribution (Unchanged)
const engagementDistribution = enrollments.reduce((acc, enrollment) => {
  if (enrollment.completionRate >= 80) acc.high++;
  else if (enrollment.completionRate >= 40) acc.medium++;
  else acc.low++;
  return acc;
}, { high: 0, medium: 0, low: 0 });


// C. NEW: Aggregate Performance & Engagement for Grouped Bar Chart
const categoryAnalytics: Record<string, { completions: number[], scores: number[], count: number }> = {};
enrollments.forEach(e => {
    if (!categoryAnalytics[e.lessonCategory]) {
        categoryAnalytics[e.lessonCategory] = { completions: [], scores: [], count: 0 };
    }
    categoryAnalytics[e.lessonCategory].completions.push(e.completionRate);
    categoryAnalytics[e.lessonCategory].scores.push(e.finalScore);
    categoryAnalytics[e.lessonCategory].count++;
});

const categoryLabels = Object.keys(categoryAnalytics);
const avgPerformanceData = categoryLabels.map(cat => {
    const data = categoryAnalytics[cat];
    return data.scores.reduce((a, b) => a + b, 0) / data.count;
});
const avgEngagementData = categoryLabels.map(cat => {
    const data = categoryAnalytics[cat];
    return data.completions.reduce((a, b) => a + b, 0) / data.count;
});


// --- 3. CHART CONFIGURATIONS (Updated) ---

// Chart 1: Enrollment Bar Chart (Unchanged)
const enrollmentChartData: import('chart.js').ChartData<'bar'> = {
  labels: Object.keys(enrollmentsByCategory),
  datasets: [{ label: 'Total Students Enrolled', data: Object.values(enrollmentsByCategory), backgroundColor: colors.indigo[500], borderRadius: 4 }],
};
const enrollmentChartOptions: import('chart.js').ChartOptions<'bar'> = {
  responsive: true,
  plugins: { legend: { display: false }, title: { display: true, text: 'Enrollment by Lesson Category 🎓', font: { size: 18 } } },
  scales: { y: { title: { display: true, text: 'Number of Students' } } },
};

// Chart 2: Engagement Doughnut Chart (Unchanged)
const engagementChartData: import('chart.js').ChartData<'doughnut'> = {
  labels: ['High Engagement (80%+)', 'Medium Engagement (40-79%)', 'Low Engagement (<40%)'],
  datasets: [{
    data: [engagementDistribution.high, engagementDistribution.medium, engagementDistribution.low],
    backgroundColor: [colors.emerald[500], colors.amber[500], colors.red[500]],
    borderColor: colors.slate[100],
    borderWidth: 3,
  }],
};
const engagementChartOptions: import('chart.js').ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: { legend: { position: 'top' }, title: { display: true, text: 'Overall Student Engagement 🧑‍💻', font: { size: 18 } } },
};

// Chart 3: NEW Grouped Bar Chart
const performanceEngagementChartData: import('chart.js').ChartData<'bar'> = {
    labels: categoryLabels,
    datasets: [
        {
            label: 'Average Performance (%)',
            data: avgPerformanceData,
            backgroundColor: colors.sky[500],
            borderRadius: 4,
        },
        {
            label: 'Average Engagement (%)',
            data: avgEngagementData,
            backgroundColor: colors.amber[400],
            borderRadius: 4,
        }
    ]
};
const performanceEngagementChartOptions: import('chart.js').ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Performance vs. Engagement 🎯', font: { size: 18 } } },
    scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage (%)' } } },
};


// --- 4. REACT COMPONENT (Updated) ---
const AggregateAnalyticsDashboard: React.FC = () => {
  const cardClasses = "p-6 bg-white rounded-xl shadow-lg";

  return (
    <div className="overflow-auto w-full font-sans bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Aggregate Analytics Dashboard</h1>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`${cardClasses} lg:col-span-2`}>
            <Bar options={enrollmentChartOptions} data={enrollmentChartData} />
          </div>
          
          <div className={cardClasses}>
            <Doughnut data={engagementChartData} options={engagementChartOptions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AggregateAnalyticsDashboard;
