# BoviFace – AI-based Cattle & Buffalo Breed Recognition  
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/sassysohom48/BoviFace)

## 🚀 Project Overview  
BoviFace is an end-to-end AI-driven mobile solution designed to help field-level workers (FLWs) capture images of Indian cattle and buffaloes and automatically classify their breed with high accuracy. By integrating mobile capture, backend processing, and machine-learning inference, BoviFace aims to reduce manual classification errors, support livestock management workflows and enable data-driven decisions.  

## 🎯 Key Features  
- Mobile app for image capture and upload of cattle/buffalo photos (via React Native)  
- Backend service (Flask) that receives images, performs preprocessing and invokes a YOLOv5-based object detection & classification model  
- Custom training on Kaggle-based and field-collected datasets to handle diverse lighting, poses and background conditions  
- Secure user authentication and data storage using Supabase (image metadata, results, user accounts)  
- Support for real-world workflow: field-level worker → capture → upload → breed result → integrate with BPA/validation system  

## 🧰 Tech Stack  
- **Frontend / Mobile**: React Native  
- **Backend / API**: Flask (Python)  
- **ML / Computer Vision**: PyTorch + YOLOv5  
- **Database / Auth / Hosting**: Supabase  
- **Datasets**: Custom–collected images + Kaggle datasets for cattle & buffalo breeds  
- **Other Tools**: Image augmentation / preprocessing (lighting, pose, background variation)  

## 📈 Project Impact  
- Designed for accuracy: the model improves classification consistency and supports field-level data correctness  
- Offers time-saving for manual identification of livestock breeds, enabling more efficient operations for users  
- Extensible architecture: the system can be adapted to other breeds, animals, or geographic regions  

## 🔧 Setup & Usage  
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/sassysohom48/BoviFace.git
