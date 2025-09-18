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
  PointElement,
  LineElement,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import colors from 'tailwindcss/colors';
import { useUserStore } from '@/utils/store';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
);

// --- FAKE DATA GENERATION ---
const quizLabels: string[] = ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5', 'Quiz 6'];
const quizScores: number[] = quizLabels.map(() => faker.number.int({ min: 65, max: 100 }));

// --- CHART 1: LINE CHART CONFIGURATION (Progress Over Time) ---
export const lineChartData: ChartData<'line'> = {
  labels: quizLabels,
  datasets: [
    {
      label: 'Score (%)',
      data: quizScores,
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 with opacity
      borderColor: colors.blue[500],
      tension: 0.3,
    },
  ],
};

export const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Quiz Score Progress Over Time 📈', font: { size: 18 } },
  },
  scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (%)' } } },
};

// --- CHART 2: DOUGHNUT CHART CONFIGURATION (Performance Breakdown) ---
const scoreDistribution: Record<string, number> = { 'Excellent (90+)': 0, 'Good (80-89)': 0, 'Satisfactory (70-79)': 0 };
quizScores.forEach(score => {
  if (score >= 90) scoreDistribution['Excellent (90+)']++;
  else if (score >= 80) scoreDistribution['Good (80-89)']++;
  else scoreDistribution['Satisfactory (70-79)']++;
});

export const doughnutChartData: ChartData<'doughnut'> = {
  labels: Object.keys(scoreDistribution),
  datasets: [
    {
      label: '# of Quizzes',
      data: Object.values(scoreDistribution),
      backgroundColor: [colors.emerald[500], colors.sky[500], colors.amber[500]],
      borderColor: colors.slate[100],
      borderWidth: 2,
    },
  ],
};

export const doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Performance Breakdown 🎯', font: { size: 18 } }
    }
}

// --- CHART 3: BAR CHART CONFIGURATION (Individual Scores) ---
export const barChartData: ChartData<'bar'> = {
  labels: quizLabels,
  datasets: [
    {
      label: 'Individual Score',
      data: quizScores,
      backgroundColor: [
        colors.red[400], colors.blue[400], colors.yellow[400],
        colors.green[400], colors.purple[400], colors.orange[400],
      ],
    },
  ],
};

export const barChartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y', // Horizontal bar chart
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Detailed Quiz Scores 📊', font: { size: 18 } },
  },
  scales: { x: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (%)' } } }
};

// --- MAIN REACT COMPONENT (Styled with Tailwind CSS) ---
const StudentProgressDashboard: React.FC = () => {
  const { getRole, getId } = useUserStore();
  const studentName = getRole();

  // Reusable card style
  const cardClasses = "p-6 bg-white rounded-xl shadow-lg";

  return (
    <div className="overflow-auto w-full font-sans bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Student Progress Dashboard</h1>
          <h2 className="text-lg text-slate-600 mt-2">
            Report for: <strong>{studentName}</strong>
          </h2>
        </header>
        
        <main className="flex flex-col gap-8">
          {/* Main Chart: Progress Line Chart */}
          <div className={cardClasses}>
            <Line options={lineChartOptions} data={lineChartData} />
          </div>

          {/* Bottom Row: Bar and Doughnut charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cardClasses}>
                <Bar options={barChartOptions} data={barChartData} />
            </div>
            <div className={cardClasses}>
                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProgressDashboard;
