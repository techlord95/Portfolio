'use client';

import React, { useRef } from 'react';
import styles from './ResumeView.module.css';
import { FaLinkedin, FaDownload } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

export default function ResumeView() {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'Srijan_Ramnani_Resume',
  });

  return (
    <div className={styles.container} ref={contentRef}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Srijan Ramnani</h1>
          <div className={styles.socials}>
            <button onClick={() => handlePrint()} className={styles.downloadButton}>
              <FaDownload /> Download PDF
            </button>
            <a 
              href="https://linkedin.com/in/srijanramnani15/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.link}
            >
              <FaLinkedin size={20} /> linkedin.com/in/srijanramnani15/
            </a>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        
        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.role}>Founding SDE</span>
            <span className={styles.company}>Intellexia AI</span>
            <span className={styles.date}>July 2025 - Present</span>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Generative AI</span>
            <span className={styles.tag}>FastAPI</span>
            <span className={styles.tag}>NextJs</span>
            <span className={styles.tag}>Docker</span>
            <span className={styles.tag}>Git</span>
            <span className={styles.tag}>System Design</span>
            <span className={styles.tag}>GCP</span>
            <span className={styles.tag}>LightGBM</span>
          </div>
          <ul className={styles.list}>
            <li>Designed and deployed a GenAI resume translation pipeline on GCP.</li>
            <li>Dockerized Puppeteer automation by building a hybrid Python + Node environment, replacing legacy Playwright architecture reducing its latency by 70%.</li>
            <li>Achieved sMAPE under 10% in MCP Price Prediction Algorithm (LightGBM) for a client in the energy sector.</li>
            <li>Leading development of a Small Language Model (SLM) focussed on translation tasks.</li>
          </ul>
        </div>

        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.role}>Data Analyst Intern</span>
            <span className={styles.company}>PwC India - Delhi NCR</span>
            <span className={styles.date}>January 2025 – July 2025</span>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Generative AI</span>
            <span className={styles.tag}>Groq</span>
            <span className={styles.tag}>Langchain</span>
            <span className={styles.tag}>Streamlit</span>
            <span className={styles.tag}>LLM</span>
            <span className={styles.tag}>Automation</span>
            <span className={styles.tag}>Git</span>
          </div>
          <ul className={styles.list}>
            <li>Automated the RFP Management System, an AI multi agentic workflow leveraging Gemini models to generate accurate excel reports, reducing specialists’ manual documentation time by 30%.</li>
            <li>Collaborated with cross functional teams (Bids, Management, Advisory , Legal ) to understand their pain points and how they can be solved using GenAI.</li>
          </ul>
        </div>

        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.role}>Data Science Intern</span>
            <span className={styles.company}>Centre For Railway Information Systems – New Delhi</span>
            <span className={styles.date}>May 2023 – Aug 2023</span>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Deep Learning</span>
            <span className={styles.tag}>Time Series Forecasting</span>
            <span className={styles.tag}>LSTM</span>
            <span className={styles.tag}>Statistical Modelling</span>
          </div>
          <ul className={styles.list}>
            <li>Preprocessed 2,00,000+ rows dataset using advanced data cleaning techniques to ensure data quality.</li>
            <li>Implemented a robust LSTM model for demand forecasting of commodities using time series data and evaluated model performance using MAE and RMSE to validate prediction reliability.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Projects</h2>

        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.role}>Claim Verification System For Insolvency Resolution Professionals</span>
            <a href="https://github.com/techlord95/Claim-Verification-Resolution-Professional" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>Github</a>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>GenAI</span>
            <span className={styles.tag}>Flask</span>
            <span className={styles.tag}>GCP</span>
            <span className={styles.tag}>OCR</span>
            <span className={styles.tag}>RAG</span>
            <span className={styles.tag}>BM25</span>
            <span className={styles.tag}>Semantic Embeddings</span>
            <span className={styles.tag}>FAISS</span>
          </div>
          <ul className={styles.list}>
            <li>Automated Claim Verification process by Integrating Gemini’s multimodal API to analyze both digital and scanned PDFs or DOCX files, leveraging its vision and text-understanding capabilities for document intelligence.</li>
          </ul>
        </div>

        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.role}>Data Analysis GenAI Excel Chatbot</span>
             <a href="https://github.com/techlord95/Data-Analysis-AI-Excel-Chatbot" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>Github</a>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Autogen</span>
            <span className={styles.tag}>Crewai</span>
            <span className={styles.tag}>Groq</span>
            <span className={styles.tag}>RAG</span>
            <span className={styles.tag}>Streamlit</span>
             <span className={styles.tag}>Huggingface</span>
          </div>
          <ul className={styles.list}>
            <li>Built an Excel-integrated GenAI chatbot that reduced exploratory data analysis effort by ~10%, minimizing reliance on pivot tables and manual slicing.</li>
          </ul>
        </div>

         <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.role}>E-Commerce Sentiment Analysis</span>
             <a href="https://github.com/techlord95/Amazon-Sentiment-Analysis" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>Github</a>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Python</span>
            <span className={styles.tag}>Machine Learning</span>
            <span className={styles.tag}>NLP</span>
            <span className={styles.tag}>Flask</span>
            <span className={styles.tag}>Docker</span>
             <span className={styles.tag}>Streamlit</span>
          </div>
          <ul className={styles.list}>
            <li>Performed web-scraping to collect user reviews data from Amazon India and developed a Support Vector Machine (SVM) model, achieving 93% overall accuracy.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Skills</h2>
  <div className={styles.item}>
    <ul className={styles.skillsList}>
      <li><strong>Programming:</strong> Python, Java, SQL, C++, HTML, CSS, Javascript</li>
      <li><strong>Frameworks & Libraries:</strong> NumPy, TensorFlow, Keras, Scikit-learn, Flask, Streamlit, FastAPI</li>
      <li><strong>GenAI & ML Tools:</strong> Langchain, Crewai, PydanticAI, Autogen, RAG, Groq, Gemini, Ollama, Llama.cpp</li>
    </ul>
  </div>
</section>


    </div>
  );
}
