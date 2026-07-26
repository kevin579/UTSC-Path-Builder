# **UTSC Path Builder** 🎓  


## 📌 **About the Project**  
UTSC Path Builder is a **course planning tool** designed to help students at the **University of Toronto Scarborough (UTSC)** efficiently plan their academic journey. The platform provides interactive features for **tracking courses, checking prerequisites, verifying program requirements, and making informed course decisions** based on peer ratings and recommendations.

---

## ✨ **Features**  
- 📚 **My Courses** – View and manage your completed and planned courses.  
- 🔗 **Course Prerequisites** – Explore prerequisite chains to plan your academic journey.  
- 🎯 **Program Requirements** – Check your degree program’s graduation requirements.  
- ⭐ **Course Rating** – See peer course ratings and contribute your own feedback.  
- 💬 **Course Feedback** – Share insights to improve course recommendations.  
- 🔍 **Course Recommendation** – Get personalized suggestions based on your academic path.  

---

## 📥 **Installation Guide**

### **Production Installation Guide** (For Deployers)



1. **Clone the Repository:**
   ```bash
   git clone https://github.com/CREATE-UofT/UTSC-Path-Builder.git
   cd utsc-path-builder
   ```

2. **Set Up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate    # Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Local Environment Variables (For Developers)**
   - Create a .env file in the project root.
   - Add the following content:
   ```bash
   SSH_HOST=your-remote-ssh-server
   SSH_PORT=your-ssh-port
   SSH_USER=your-ssh-username
   SSH_PASSWORD=your-ssh-password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=AI_CourseCalV2
   ```
   - Ensure .env is ignored in Git:
   ```bash
   echo .env >> .gitignore
   ```
5. **Launch the website**
   ```bash
   cd flask
   python app.py
   ```
   - The app will run on http://127.0.0.1:5000/
   
## 🚀 **Getting Started**  
To start using UTSC Path Builder, follow these steps:  

1. **Log in** to your account to access personalized features.  
2. **Add your completed courses** to "My Courses."  
3. **Explore course prerequisites** for subjects you’re interested in.  
4. **Check program requirements** to ensure you’re on track to graduate.  

---

## 🛠 **Tech Stack**  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Flask (Python)  
- **Database:** MySQL/PostgreSQL  

---

