<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Quản lý hỗ trợ khách hàng</h1>

    <!-- Form Thêm / Sửa Chat -->
    <div class="mb-4 border p-4 rounded-lg bg-gray-100">
      <h2 class="text-lg font-semibold">
        {{ editingChat ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới' }}
      </h2>
      <input v-model="chat.question" placeholder="Nhập câu hỏi" class="input" />
      <input v-model="chat.result" placeholder="Nhập câu trả lời" class="input" />
      <button @click="saveChat" class="btn btn-primary">
        {{ editingChat ? 'Cập nhật' : 'Thêm' }}
      </button>
      <button v-if="editingChat" @click="cancelEdit" class="btn btn-secondary">Hủy</button>
    </div>

    <!-- Danh sách Chat -->
    <table class="table-auto w-full border-collapse border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Câu Hỏi</th>
          <th class="border p-2">Câu Trả Lời</th>
          <th class="border p-2">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in chats" :key="item.id" class="border">
          <td class="p-2">{{ item.question }}</td>
          <td class="p-2">{{ item.result }}</td>
          <td class="p-2">
            <button @click="editChat(item)" class="btn btn-warning">Sửa</button>
            <button @click="deleteChat(item.id)" class="btn btn-danger">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      chats: [],
      chat: { id: '0', question: '', result: '', stats: '0' },
      editingChat: null,
    }
  },
  methods: {
    async fetchChats() {
      const res = await axios.get('http://localhost:5121/api/chat/all')
      this.chats = res.data
    },
    async saveChat() {
      // Hiển thị hộp thoại xác nhận trước khi thêm mới hoặc cập nhật câu hỏi
      const isConfirmed = confirm('Bạn có chắc chắn muốn lưu thay đổi?');

      if (isConfirmed) {
        if (this.editingChat) {
          // Nếu đang chỉnh sửa, thực hiện PATCH
          await axios.patch(`http://localhost:5121/api/chat/update/${this.editingChat.id}`, this.chat);
        } else {
          // Nếu không chỉnh sửa, thực hiện POST để thêm câu hỏi mới
          await axios.post('http://localhost:5121/api/chat/add', this.chat);
        }
        // Reset lại form và state
        this.chat = { id: '0', question: '', result: '', stats: '0' };
        this.editingChat = null;

        // Lấy lại danh sách câu hỏi mới
        this.fetchChats();
      } else {
        this.chat = { id: '0', question: '', result: '', stats: '0' };
        this.editingChat = null;
        console.log('Thao tác bị hủy.');
      }
    },
    editChat(chat) {
      this.chat = { ...chat }
      this.editingChat = chat
    },
    cancelEdit() {
      this.chat = { question: '', result: '' }
      this.editingChat = null
    },
    async deleteChat(id) {
      const confirmDelete = confirm("Bạn có chắc chắn muốn xoá câu hỏi này không?");
      if (confirmDelete) {
        // Gọi API để xoá
        await axios.delete(`http://localhost:5121/api/chat/delete/${id}`);
        // Sau khi xoá, làm mới danh sách câu hỏi
        this.fetchChats();
      }
    },
  },
  mounted() {
    this.fetchChats()
  },
}
</script>

<style>
.input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.btn {
  padding: 8px 15px;
  margin-right: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.table-auto {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.table-auto th,
.table-auto td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.table-auto th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.p-4 {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.border {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.rounded-lg {
  border-radius: 10px;
}

.bg-gray-100 {
  background-color: #f8f9fa;
}

.bg-gray-200 {
  background-color: #e9ecef;
}

.text-xl {
  font-size: 24px;
}

.text-lg {
  font-size: 20px;
}

.text-semibold {
  font-weight: 600;
}

.p-2 {
  padding: 12px;
}
</style>