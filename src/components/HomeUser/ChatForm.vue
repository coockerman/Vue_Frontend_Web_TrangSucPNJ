<template>
  <div class="chat-container">
    <div class="chat-icon" @click="toggleChat">💬</div>

    <div v-if="isChatOpen" class="chat-box">
      <div class="chat-header">
        <span>Hỏi đáp</span>
        <button @click="toggleChat">✖</button>
      </div>

      <div class="chat-body">
        <div v-if="selectedQuestion">
          <div class="question">{{ selectedQuestion.question }}</div>
          <div class="answer">{{ selectedQuestion.result }}</div>
          <button class="back-btn" @click="selectedQuestion = null">⬅ Quay lại</button>
        </div>

        <div v-else>
          <div
            v-for="(question, index) in questions"
            :key="index"
            class="question-item"
            @click="selectQuestion(question)"
          >
            {{ question.question }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import axios from 'axios'

export default {
  data() {
    return {
      isChatOpen: false,
      questions: [],
      selectedQuestion: null,
    }
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen
    },
    async fetchQuestions() {
      try {
        const response = await axios.get('http://localhost:5121/api/chat/all') // Lấy top 6 câu hỏi nhiều nhất
        this.questions = response.data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách câu hỏi:', error)
      }
    },
    selectQuestion(question) {
      this.selectedQuestion = question
    },
  },
  mounted() {
    this.fetchQuestions()
  },
}
</script>
  
  <style>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.chat-icon {
  width: 50px;
  height: 50px;
  background: #948742;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
}

.chat-box {
  width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.chat-header {
  background: #948742;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.chat-body {
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.question-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.question-item:hover {
  background: #f1f1f1;
}

.question {
  font-weight: bold;
  margin-bottom: 5px;
}

.answer {
  color: #333;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.back-btn {
  margin-top: 10px;
  background: #53877e;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
  