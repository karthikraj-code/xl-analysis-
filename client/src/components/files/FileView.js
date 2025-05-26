import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFileDetails } from '../../store/slices/filesSlice';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FileView = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();
  const { currentFile, loading, error } = useSelector((state) => state.files);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedChart, setSelectedChart] = useState('line');

  useEffect(() => {
    dispatch(fetchFileDetails(fileId));
  }, [dispatch, fileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">File not found.</p>
      </div>
    );
  }

  const renderChart = () => {
    if (!selectedSheet || !currentFile.data[selectedSheet]) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">Select a sheet to view charts.</p>
        </div>
      );
    }

    const sheetData = currentFile.data[selectedSheet];
    const labels = sheetData.headers;
    const datasets = sheetData.rows.map((row, index) => ({
      label: `Series ${index + 1}`,
      data: row,
      borderColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      backgroundColor: `hsla(${(index * 137.5) % 360}, 70%, 50%, 0.5)`,
    }));

    const chartData = {
      labels,
      datasets,
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${currentFile.filename} - ${selectedSheet}`,
        },
      },
    };

    switch (selectedChart) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{currentFile.filename}</h2>
        <div className="flex space-x-4">
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="form-select"
          >
            <option value="">Select Sheet</option>
            {Object.keys(currentFile.data).map((sheet) => (
              <option key={sheet} value={sheet}>
                {sheet}
              </option>
            ))}
          </select>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="form-select"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {renderChart()}
      </div>

      {selectedSheet && currentFile.data[selectedSheet] && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {currentFile.data[selectedSheet].headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFile.data[selectedSheet].rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileView; 