<template>
  <div class="reports-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Business Reports</h1>
          <p class="page-subtitle">Track your business performance and analytics</p>
        </div>
        <div class="export-actions">
          <button class="btn btn-secondary" @click="exportCSV">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16L12 4M12 4L8 8M12 4L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 12H6C4.89543 12 4 12.8954 4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14C20 12.8954 19.1046 12 18 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Export CSV
          </button>
          <button class="btn btn-primary" @click="exportPDF">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Export PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card status-total-sales">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Total Sales</span>
          <span class="card-value">₱{{ stats.totalSales.toLocaleString() }}</span>
        </div>
      </div>

      <div class="summary-card status-total-users">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Total Users</span>
          <span class="card-value">{{ stats.totalUsers }}</span>
        </div>
      </div>

      <div class="summary-card status-delivered">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Delivered Orders</span>
          <span class="card-value">{{ orderSummary.delivered || 0 }}</span>
        </div>
      </div>

      <div class="summary-card status-pending">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Pending Orders</span>
          <span class="card-value">{{ orderSummary.pending || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Orders Section -->
    <div class="orders-section">
      <div class="section-header">
        <h2>Recent Orders</h2>
        <button class="btn btn-secondary" @click="loadOrders">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4V16C4 17.1046 4.89543 18 6 18H20M20 18L16 14M20 18L16 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>
      
      <div class="orders-table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="order-id">#{{ order.id }}</td>
              <td class="customer-name">{{ order.customer_name }}</td>
              <td class="order-date">{{ formatDate(order.created_at) }}</td>
              <td class="order-amount">₱{{ order.total_amount.toLocaleString() }}</td>
              <td class="order-status">
                <span :class="['status-badge', `status-${order.status}`]">
                  {{ order.status }}
                </span>
              </td>
              <td class="order-actions">
                <button class="btn-icon" @click="viewOrder(order.id)" title="View Details">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="6" class="no-orders">
                <div class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9H21M9 21V9M5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5Z" stroke="#4a7c6d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p>No orders found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Monthly Sales Chart -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>Monthly Sales Trend</h3>
          <div class="chart-actions">
            <button class="btn-icon" title="Download Chart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 4M12 4L8 8M12 4L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 12H6C4.89543 12 4 12.8954 4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14C20 12.8954 19.1046 12 18 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="monthlySalesChart"></canvas>
        </div>
      </div>

      <!-- Daily Sales Chart -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>Daily Sales</h3>
          <div class="date-filters">
            <div class="filter-group">
              <label>From</label>
              <input type="date" v-model="dateRange.start" class="date-input">
            </div>
            <div class="filter-group">
              <label>To</label>
              <input type="date" v-model="dateRange.end" class="date-input">
            </div>
            <button class="btn btn-primary btn-sm" @click="loadDailySales">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Apply
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="dailySalesChart"></canvas>
        </div>
      </div>

      <!-- Small Charts Grid -->
      <div class="small-charts-grid">
        <!-- Top Products Chart -->
        <div class="chart-card small">
          <div class="chart-header">
            <h3>Top Selling Products</h3>
          </div>
          <div class="chart-container">
            <canvas id="topProductsChart"></canvas>
          </div>
        </div>

        <!-- Order Status Chart -->
        <div class="chart-card small">
          <div class="chart-header">
            <h3>Order Status</h3>
          </div>
          <div class="chart-container">
            <canvas id="orderStatusChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Define the primary color palette based on #0a3c2b
const PRIMARY_COLOR = "#0a3c2b"; // Dark Forest Green (Base)
const ACCENT_COLOR_1 = "#1e7952"; // Mid Green (Buttons, Bar charts)
const ACCENT_COLOR_2 = "#53b584"; // Light Green (Highlight text/values)
const BACKGROUND_LIGHT = "#155a40"; // Card Background
const CONTRAST_COLOR = "#FFFFFF"; // For high readability text

export default {
  name: "Reports",

  data() {
    return {
      stats: {
        totalSales: 0,
        totalUsers: 0,
      },
      orderSummary: {},
      monthlySales: [],
      dailySales: [],
      topProducts: [],
      orders: [], // Added orders array

      dateRange: {
        start: "",
        end: "",
      },

      charts: {},
    };
  },

  mounted() {
    this.loadAllReports();
  },

  methods: {
    auth() {
      return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
    },

    async loadAllReports() {
      await Promise.all([
        this.loadTotalSales(),
        this.loadTotalUsers(),
        this.loadOrderSummary(),
        this.loadMonthlySales(),
        this.loadDailySales(),
        this.loadTopProducts(),
        this.loadOrders(), // Added loadOrders
      ]);
    },

    // FETCH DATA methods remain the same...
    async loadTotalSales() {
      const res = await axios.get("/api/admin/reports/total-sales", this.auth());
      this.stats.totalSales = res.data.total_sales || 0;
    },

    async loadTotalUsers() {
      const res = await axios.get("/api/admin/reports/total-users", this.auth());
      this.stats.totalUsers = res.data.total_users || 0;
    },

    async loadOrderSummary() {
      const res = await axios.get("/api/admin/reports/orders-summary", this.auth());
      this.orderSummary = {};
      res.data.forEach(s => {
        this.orderSummary[s.status] = s.count;
      });
      this.buildOrderStatusChart();
    },

    async loadMonthlySales() {
      const res = await axios.get("/api/admin/reports/monthly-sales", this.auth());
      this.monthlySales = res.data;
      this.buildMonthlySalesChart();
    },

    async loadDailySales() {
      const res = await axios.get("/api/admin/reports/sales-per-day", {
        ...this.auth(),
        params: {
          start: this.dateRange.start || "2024-01-01",
          end: this.dateRange.end || "2099-12-31",
        }
      });
      this.dailySales = res.data;
      this.buildDailySalesChart();
    },

    async loadTopProducts() {
      const res = await axios.get("/api/admin/reports/top-products", this.auth());
      this.topProducts = res.data;
      this.buildTopProductsChart();
    },

    // Added loadOrders method
    async loadOrders() {
      try {
        const res = await axios.get("/api/admin/orders", {
          ...this.auth(),
          params: {
            limit: 10, // Show last 10 orders
            sort: 'created_at',
            order: 'desc'
          }
        });
        this.orders = res.data.orders || [];
      } catch (error) {
        console.error("Error loading orders:", error);
        this.orders = [];
      }
    },

    // Added utility methods
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    viewOrder(orderId) {
      // Navigate to order details or show modal
      this.$router.push(`/admin/orders/${orderId}`);
    },

    // CHARTS: Colors updated, scales should auto-adjust to white background
    buildMonthlySalesChart() {
      const ctx = document.getElementById("monthlySalesChart");
      if (this.charts.monthly) this.charts.monthly.destroy();

      this.charts.monthly = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.monthlySales.map(x => x.month),
          datasets: [
            {
              label: "Sales (₱)",
              data: this.monthlySales.map(x => x.monthly_sales),
              borderColor: ACCENT_COLOR_1, // Mid Green
              backgroundColor: `${ACCENT_COLOR_1}40`, // Mid Green with 25% opacity
              borderWidth: 3,
              tension: 0.4,
            }
          ]
        },
        options: {
            // Set scale colors to black/dark for readability against white chart area
            scales: {
                x: { ticks: { color: "#333" }, grid: { color: "#eee" } },
                y: { ticks: { color: "#333" }, grid: { color: "#eee" } },
            },
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },

    buildDailySalesChart() {
      const ctx = document.getElementById("dailySalesChart");
      if (this.charts.daily) this.charts.daily.destroy();

      this.charts.daily = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.dailySales.map(x => x.date),
          datasets: [{
            label: "Daily Sales (₱)",
            data: this.dailySales.map(x => x.daily_sales),
            backgroundColor: ACCENT_COLOR_1 // Mid Green
          }]
        },
        options: {
            scales: {
                x: { ticks: { color: "#333" }, grid: { color: "#eee" } },
                y: { ticks: { color: "#333" }, grid: { color: "#eee" } },
            },
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },

    buildTopProductsChart() {
      const ctx = document.getElementById("topProductsChart");
      if (this.charts.top) this.charts.top.destroy();

      this.charts.top = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.topProducts.map(x => x.name),
          datasets: [{
            label: "Units Sold",
            data: this.topProducts.map(x => x.total_sold),
            backgroundColor: PRIMARY_COLOR // Dark Forest Green
          }]
        },
        options: {
            indexAxis: 'y', // Horizontal bars for product names
            scales: {
                x: { ticks: { color: "#333" }, grid: { color: "#eee" } },
                y: { ticks: { color: "#333" }, grid: { color: "#eee" } },
            },
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },

    buildOrderStatusChart() {
      const ctx = document.getElementById("orderStatusChart");
      if (this.charts.status) this.charts.status.destroy();

      this.charts.status = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(this.orderSummary),
          datasets: [{
            data: Object.values(this.orderSummary),
            // Distinctive colors for status: Green, Dark Green, Gray, Red
            backgroundColor: [ACCENT_COLOR_1, PRIMARY_COLOR, "#7f8c8d", "#c0392b"],
            hoverBackgroundColor: [ACCENT_COLOR_2, PRIMARY_COLOR, "#95a5a6", "#e74c3c"]
          }]
        },
        options: {
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },

    exportCSV() {
      // Export logic remains the same
      const csv =
        ["Metric,Value",
        `Total Sales,${this.stats.totalSales}`,
        `Total Users,${this.stats.totalUsers}`].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      a.click();
    },

    exportPDF() {
      window.print();
    }
  }
};
</script>

<style scoped>
.reports-container {
  padding: 24px;
  background: #f8fdfb;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section .page-title {
  color: #0a3c2b;
  font-weight: 700;
  font-size: 32px;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.title-section .page-subtitle {
  color: #4a7c6d;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.export-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #1a7d5e;
  color: white;
}

.btn-primary:hover {
  background: #0a3c2b;
}

.btn-secondary {
  background: #f0f9f5;
  color: #1a7d5e;
  border: 1px solid #c8e6d9;
}

.btn-secondary:hover {
  background: #e0f0e9;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 13px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e0f0e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a7c6d;
}

.btn-icon:hover {
  background: #f0f9f5;
  border-color: #1a7d5e;
  color: #0a3c2b;
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.12);
}

.summary-card.status-total-users {
  border-left: 4px solid #1e40af; /* Deep blue */
}

.summary-card.status-total-sales {
  border-left: 4px solid  #f59e0b; /* Bronze */
}

.summary-card.status-delivered {
  border-left: 4px solid #047857; /* Emerald green */
}

.summary-card.status-pending {
  border-left: 4px solid #dc2626; /* Red for urgency */
}
.card-icon {
  width: 48px;
  height: 48px;
  background: #f0f9f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a7d5e;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  color: #4a7c6d;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.card-value {
  color: #0a3c2b;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

/* Orders Section */
.orders-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 20px;
  margin: 0;
}

/* Orders Table */
.orders-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e0f0e9;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.orders-table th {
  background: #f8fdfb;
  color: #0a3c2b;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  padding: 16px;
  border-bottom: 2px solid #e0f0e9;
}

.orders-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f9f5;
  color: #4a7c6d;
  font-size: 14px;
}

.orders-table tr:hover {
  background: #f8fdfb;
}

.orders-table tr:last-child td {
  border-bottom: none;
}

.order-id {
  font-weight: 600;
  color: #0a3c2b;
  font-family: 'Monaco', 'Consolas', monospace;
}

.customer-name {
  font-weight: 500;
}

.order-amount {
  font-weight: 600;
  color: #0a3c2b;
}

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

/* Empty State */
.no-orders {
  text-align: center;
  padding: 60px 20px !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #4a7c6d;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* Charts Section */
.charts-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.small-charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
}

.chart-card.large {
  min-height: 400px;
}

.chart-card.small {
  min-height: 300px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}

.date-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  color: #4a7c6d;
  font-size: 12px;
  font-weight: 500;
}

.date-input {
  padding: 6px 8px;
  border: 1px solid #c8e6d9;
  border-radius: 6px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.date-input:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.chart-container {
  height: 100%;
  min-height: 300px;
  position: relative;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reports-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .export-actions {
    justify-content: center;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .small-charts-grid {
    grid-template-columns: 1fr;
  }
  
  .date-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .orders-table {
    font-size: 13px;
  }

  .orders-table th,
  .orders-table td {
    padding: 12px 8px;
  }
}

@media (max-width: 480px) {
  .summary-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
  }
  
  .card-value {
    font-size: 20px;
  }
}
</style>