# 📘 Sahayak: AI-Powered Teaching Assistant for Teachers

Being a teacher or working in education can be super rewarding, but let's face it — the workload, especially prep work, can be challenging. There's often not enough staff, and tutoring can be expensive.

**Sahayak** is an AI-powered teaching assistant designed to support educators with lesson preparation, multilingual content creation, and classroom engagement.

---

## ✅ What Sahayak Does

- **Simplifies Prep Work** – Auto-generates lesson plans, quizzes, worksheets  
- **Supports Local Languages** – Handles regional input via Gemini  
- **Creates Interactive Content** – Visuals, games, and learning materials  
- **Adds Audio Power** – Audio materials and speech-driven responses  

---

## ⚙️ Built With

Google technologies:  
- **ADK (Agent Development Kit)**  
- **Vertex AI**  
- **Gemini API**  P
- **Firebase Studio**

---

## 🌍 Impact

- Empowers teachers  
- Enables personalized learning  
- Brings AI into classrooms that need it most  

---

## 🧰 Features Offered by Sahayak

### 📚 Course Material Generation
- Lesson Planner  
- Assessment Builder  
- Worksheet Creator  

### 🌐 Multilingual Interactive Learning
- Blackboard-Friendly Diagrams  
- Chart Generator  
- Concept Visualization  
- Game Builder (Activity, Quiz)  

### 🧑‍🏫 Teacher & Student Support Tools
- Easy-to-use GUI  
- Speech-to-Text Q&A  
- Resource Library  
- Export Options (print/share-friendly)

---

## 🔍 How It Differs from Existing Solutions

- **Hyper-localization**: Generates content in regional languages with culturally relevant examples  
- **Teacher-focused**: Unlike most EdTech tools that are student-facing, this is a teacher productivity tool  
- **Low-tech compatibility**: Works even without 1:1 devices; supports print and blackboard formats  
- **Multimodal input/output**: Supports voice, text, image input with rich and diverse outputs  

---

## 🎯 How It Solves the Problem

- **Reduces preparation time**: Automates creation of lesson plans, worksheets, and visuals  
- **Enables differentiation**: Generates content at different complexity levels  
- **Bridges resource gaps**: Delivers high-quality materials even in under-resourced schools  
- **Supports local languages**: Works in vernacular languages, enhancing comprehension  

---

## 🌟 Unique Selling Proposition (USP)

- Designed for **multi-grade classrooms** in rural India  
- Works within **existing infrastructure** and **low-connectivity** constraints  
- Generates **culturally contextual** content relevant to local communities  
- Simplified **UX for low digital literacy** among teachers  

---

## usecase

<img width="975" height="459" alt="image" src="https://github.com/user-attachments/assets/1cfddfc5-e024-4431-b224-ea1675b801ba" />


## Architecture 

<img width="975" height="543" alt="image" src="https://github.com/user-attachments/assets/b0686aec-0978-47b7-a2f9-1c927c925225" />


## 🧠 Basic Agent Workflow (ADK Web)

<img width="832" height="501" alt="image" src="https://github.com/user-attachments/assets/1fb39da8-37ca-45eb-858b-1a5a6049bfc6" />


1. Teacher submits request via Runner UI  
2. Runner sets up session, state, and memory  
3. Root Agent receives and routes the request  
4. Agent calls `retrieve_lesson_content`  
5. Query is embedded using **Vertex AI**  
6. **Vector Search** fetches relevant content  
7. **Gemini Flash** generates a lesson plan  
8. Plan is returned to the teacher  

---

## 🛠️ Technologies Used

- **Google Cloud Platform (GCP)**  
  - **Vertex AI** – Gemini 2.5 Flash for LLM and vector search  
  - **Cloud Run** – Deploy serverless containers  
  - **Pub/Sub & Eventarc** – Event-driven architecture  
  - **Cloud Storage** – Stores lesson plans, PDFs, audio  
  - **Firestore** – Hosts HTML/JSON content  
  - **Artifact Registry** – Stores container images  

- **Gemini 2.5 Flash (LLM)**  
  - Dynamic HTML/quiz generation, summarization, and content creation  

- **Google ADK**  
  - Builds intelligent, event-driven, agentic LLM workflows  
  - Handles orchestration, tool use, and retrieval operations  

---

## ✏️ Optional: Wireframes / Mockups

<img width="975" height="616" alt="image" src="https://github.com/user-attachments/assets/0c8443cc-73fe-435f-8917-14a3595915a8" />


Mockups can include:

- **Teacher Dashboard**  
  - Lesson Plan Generator  
  - Audio/Visual Content Creation  
  - Export & Print Tools  

- **Student Interface**  
  - Interactive Fraction Games  
  - Audio Lessons in Local Languages  
  - Worksheet Download Area  

---

> Sahayak is not just another EdTech tool—it's an AI-native partner built to uplift the classroom experience, especially in underserved schools.
