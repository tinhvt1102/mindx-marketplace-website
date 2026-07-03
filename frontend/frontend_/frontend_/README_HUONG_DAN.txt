HUONG DAN DAN PATCH FRONTEND

1) Giai nen file zip nay.
2) Copy toan bo cac file/folder ben trong vao:
   mindx-marketplace-website/frontend/seafood-app
3) Khi Windows hoi co ghi de file cu khong, chon Replace/Overwrite.
4) Dam bao backend dang chay o port 5000:
   cd backend
   npm run dev
5) Chay frontend:
   cd frontend/seafood-app
   npm install
   npm run dev
6) Dang nhap frontend bang tai khoan co trong MongoDB, vi du:
   buyer@vam.vn / 123456
   admin@vam.vn / 123456
7) Test flow:
   Dang nhap -> Mua le -> Them vao gio -> Gio hang -> Thanh toan -> MongoDB orders tang document.

Luu y:
- File .env frontend chi co VITE_API_BASE_URL=http://localhost:5000/api, khong co password.
- Backend/.env van phai tu tao rieng, khong push len GitHub.
