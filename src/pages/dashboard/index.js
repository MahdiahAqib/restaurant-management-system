import React, { useState } from 'react';
import Head from 'next/head';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import styles from '../../styles/Dashboard.module.css';

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
  const totalRevenue = 8400;

  // State for selecting view (Day, Week, Month)
  const [timeFrame, setTimeFrame] = useState('week');
  
  // Orders breakdown
  const orderStatusData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [{
      label: 'Order Status',
      data: [70, 20, 10],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  // Revenue data (Day, Week, Month view)
  const revenueData = {
    day: [400, 500, 600, 700, 300, 800, 1200],
    week: [2500, 2800, 3200, 2900, 3300, 3500, 3700],
    month: [10500, 10800, 11200, 11500, 11300, 12000, 11800],
  };

  const revenueLineData = {
    labels: timeFrame === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
      timeFrame === 'week' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Revenue',
      data: revenueData[timeFrame],
      borderColor: '#FF6384',
      tension: 0.3,
      fill: false
    }]
  };

  // Customer trend data (Day, Week, Month view)
  const customerTrendData = {
    day: [100, 120, 150, 80, 90, 110, 130],
    week: [800, 1000, 1200, 900, 1100, 1250, 1300],
    month: [3500, 4000, 4500, 4300, 4600, 4700, 4800],
  };

  const customerLineData = {
    labels: timeFrame === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
      timeFrame === 'week' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Visitors',
      data: customerTrendData[timeFrame],
      borderColor: '#4BC0C0',
      tension: 0.3
    }]
  };

  // Sales by category data
  const categoryBarData = {
    labels: ['Burgers', 'Pizzas', 'Drinks', 'Desserts'],
    datasets: [{
      label: 'Sales',
      data: [300, 500, 200, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AA66CC']
    }]
  };

  // Customer ratings bar chart
  const customerRatingData = {
    labels: ['Food Quality', 'Service', 'Ambiance', 'Value for Money'],
    datasets: [{
      label: 'Ratings (out of 5)',
      data: [4.5, 4.2, 4.7, 4.3],
      backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384', '#36A2EB']
    }]
  };

  return (
    <>
      <Head>
        <title>Dashboard | Restaurant Admin</title>
      </Head>
      <div className={styles.dashboardLayout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <ul className={styles.sidebarMenu}>
            <li>Dashboard</li>
            <li>Orders</li>
            <li>Reservations</li>
            <li>Menu</li>
            <li>Customers</li>
          </ul>
        </aside>
        <div className={styles.container}>
          <h1 className={styles.heading}>Dashboard</h1>

          {/* Top metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricTitle}>Today’s Reservations</span>
              <h2>34</h2>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricTitle}>Active Orders</span>
              <h2>12</h2>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricTitle}>Total Revenue</span>
              <h2>${totalRevenue}</h2>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricTitle}>Staff On Duty</span>
              <h2>6</h2>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricTitle}>Total Customers</span>
              <h2>1,000</h2>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricTitle}>Total Menu Items</span>
              <h2>120</h2>
            </div>
          </div>

          {/* First row of charts */}
          <div className={styles.chartGrid}>
            <div className={styles.chartBox}>
              <div className={styles.chartTitle}>Order Status Breakdown</div>
              <Doughnut
                data={orderStatusData}
                options={{ plugins: { legend: { position: 'bottom' } } }}
              />
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
              <Line
                data={revenueLineData}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          {/* Second row of charts */}
          <div className={styles.bottomGrid}>
            <div className={styles.chartBox}>
              <div className={styles.chartTitle}>Sales by Category</div>
              <Bar
                data={categoryBarData}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
            <div className={styles.chartBox}>
              <div className={styles.chartTitle}>Customer Ratings</div>
              <Bar
                data={customerRatingData}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          {/* Third row of charts */}
          <div className={styles.chartGrid} style={{ marginTop: '2rem' }}>
            <div className={styles.chartBox}>
              <div className={styles.chartTitle}>Customer Visits Trend</div>
              <Line
                data={customerLineData}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          {/* Top Selling Items table */}
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
      </div>
    </>
  );
};

export default Dashboard;
