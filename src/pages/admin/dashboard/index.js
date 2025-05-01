import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import styles from '../../../styles/Dashboard.module.css';
import AdminLayout from '../../../components/AdminLayout';


import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const [staffCount, setStaffCount] = useState(6); // Default to 6 while loading
  const [userCount, setUserCount] = useState(6); // Default to 6 while loading
  const totalRevenue = 8400;
  const [timeFrame, setTimeFrame] = useState('week');

  useEffect(() => {
    const fetchStaffCount = async () => {
      try {
        const response = await fetch('/api/staff/count');
        const data = await response.json();
        if (data.count !== undefined) {
          setStaffCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch staff count:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/user/count');
        const data = await response.json();
        if (data.count !== undefined) {
          setUserCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };
  
    fetchStaffCount();
    fetchUserCount();
  }, []);

  // Chart data configurations
  const orderStatusData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [{
      data: [70, 20, 10],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      borderColor: '#1e1e1e',
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  const revenueData = {
    day: [400, 500, 600, 700, 300, 800, 1200],
    week: [2500, 2800, 3200, 2900, 3300, 3500, 3700],
    month: [10500, 10800, 11200, 11500, 11300, 12000, 11800],
  };

  const revenueLineData = {
    labels: timeFrame === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            timeFrame === 'week' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Revenue ($)',
      data: revenueData[timeFrame],
      borderColor: '#FF6384',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#FF6384',
      pointHoverRadius: 6,
      borderWidth: 2
    }]
  };

  const customerTrendData = {
    day: [100, 120, 150, 80, 90, 110, 130],
    week: [800, 1000, 1200, 900, 1100, 1250, 1300],
    month: [3500, 4000, 4500, 4300, 4600, 4700, 4800],
  };

  const customerLineData = {
    labels: timeFrame === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            timeFrame === 'week' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Visitors',
      data: customerTrendData[timeFrame],
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#4BC0C0',
      pointHoverRadius: 6,
      borderWidth: 2
    }]
  };

  const categoryBarData = {
    labels: ['Burgers', 'Pizzas', 'Drinks', 'Desserts'],
    datasets: [{
      label: 'Sales ($)',
      data: [300, 500, 200, 100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(170, 102, 204, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(170, 102, 204, 1)'
      ],
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const customerRatingData = {
    labels: ['Food Quality', 'Service', 'Ambiance', 'Value'],
    datasets: [{
      label: 'Ratings (out of 5)',
      data: [4.5, 4.2, 4.7, 4.3],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ddd',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        titleColor: '#fff',
        bodyColor: '#ddd',
        borderColor: '#444',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#aaa'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#aaa'
        }
      }
    }
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '65%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Restaurant Admin</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>Dashboard</h1>

        {/* Top metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Today's Reservations</span>
            <h2 className={styles.metricValue}>34</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Active Orders</span>
            <h2 className={styles.metricValue}>12</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Revenue</span>
            <h2 className={styles.metricValue}>${totalRevenue}</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Staff</span>
            <h2 className={styles.metricValue}>{staffCount}</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Customers</span>
            <h2 className={styles.metricValue}>{userCount}</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Menu Items</span>
            <h2 className={styles.metricValue}>120</h2>
          </div>
        </div>

        {/* First row of charts */}
        <div className={styles.chartRow}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Order Status Breakdown</div>
            <div className={`${styles.chartContent} ${styles.doughnutChart}`}>
              <Doughnut data={orderStatusData} options={doughnutOptions} />
            </div>
          </div>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>
              Revenue Trend
              <select 
                className={styles.timeFrameDropdown} 
                value={timeFrame} 
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className={`${styles.chartContent} ${styles.lineChart}`}>
              <Line data={revenueLineData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Second row of charts */}
        <div className={styles.chartRow}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Sales by Category</div>
            <div className={`${styles.chartContent} ${styles.barChart}`}>
              <Bar data={categoryBarData} options={chartOptions} />
            </div>
          </div>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Customer Ratings</div>
            <div className={`${styles.chartContent} ${styles.barChart}`}>
              <Bar data={customerRatingData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Third row of charts */}
        <div className={styles.chartRow}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Customer Visits Trend</div>
            <div className={`${styles.chartContent} ${styles.lineChart}`}>
              <Line data={customerLineData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Top Selling Items Table */}
        <div className={styles.tableBox}>
          <h3 className={styles.chartTitle}>Top Selling Items</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🍔 Cheese Burger</td>
                <td>120</td>
                <td>$600</td>
              </tr>
              <tr>
                <td>🍕 Margherita Pizza</td>
                <td>90</td>
                <td>$720</td>
              </tr>
              <tr>
                <td>🥤 Chocolate Shake</td>
                <td>80</td>
                <td>$320</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);

export default Dashboard;