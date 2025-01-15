# เลือก base image
FROM node

# กำหนด directory เริ่มต้นใน container
WORKDIR /usr/src/app

# คัดลอก package.json และ lock file
COPY package.json ./
COPY package-lock.json ./ 

# ติดตั้ง dependencies
RUN npm install

# ติดตั้ง Prisma CLI
RUN npm install prisma @prisma/client

# คัดลอกโค้ดทั้งหมด
COPY . ./

# สร้าง Prisma Client และ build แอปพลิเคชัน
RUN npx prisma generate
RUN npm run build

# เปิด port 3000
EXPOSE 3000

# กำหนดคำสั่งเริ่มต้น
CMD ["npm", "start"]
