pipeline {
    agent any
    environment {
        IMAGE_NAME = 'flask-notes-app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/theshubhamgour/flask-portfolio.git'
            }
        }

        stage('Run Lint Test') {
            steps {
                sh 'pip3 install --break-system-packages flake8'
                sh 'flake8 . || true'
                  }
            }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
            }
        }

        stage('Deploy to Stage') {
            steps {
                sh 'docker run -d -p 5000:5000 $IMAGE_NAME:$BUILD_NUMBER'
            }
        }
    }

    post {
        success { echo '✅ Build, Test, and Deploy completed successfully!' }
        failure { echo '❌ Pipeline failed. Check logs.' }
    }
}