<template>
  <div class="revenue-view">
    <h1 class="text-xl font-bold">Báo cáo doanh thu</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <RevenueCard title="Doanh thu tuần" :amount="weeklyRevenue" />
      <RevenueCard title="Doanh thu tháng" :amount="monthlyRevenue" />
      <RevenueCard title="Doanh thu quý" :amount="quarterlyRevenue" />
      <RevenueCard title="Doanh thu năm" :amount="yearlyRevenue" />
    </div>
  </div>
</template>
  
  <script>
import axios from 'axios'
import RevenueCard from '@/components/HomeAdmin/RevenueCard.vue'

export default {
  components: { RevenueCard },
  data() {
    return {
      weeklyRevenue: 0,
      monthlyRevenue: 0,
      quarterlyRevenue: 0,
      yearlyRevenue: 0,
    }
  },
  async mounted() {
    await this.fetchRevenueData()
  },
  methods: {
    async fetchRevenueData() {
      try {
        const [weekly, monthly, quarterly, yearly] = await Promise.all([
          axios.get('http://localhost:5121/api/revenues/weekly'),
          axios.get('http://localhost:5121/api/revenues/monthly'),
          axios.get('http://localhost:5121/api/revenues/quarterly'),
          axios.get('http://localhost:5121/api/revenues/yearly'),
        ])
        this.weeklyRevenue = weekly.data.revenue
        this.monthlyRevenue = monthly.data.revenue
        this.quarterlyRevenue = quarterly.data.revenue
        this.yearlyRevenue = yearly.data.revenue
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu', error)
      }
    },
  },
}
</script>
  
  <style scoped>
.revenue-view {
  padding: 20px;
}
</style>
  