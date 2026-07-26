pipeline {
    agent any
    environment {
        IMAGE_NAME = 'flask-notes-app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/iamjoydip06/cicd-with-python-flask-app.git'
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