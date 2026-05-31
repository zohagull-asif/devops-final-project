pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo "Building from GitHub"
            }
        }
        stage('Build Images') {
            steps {
                dir('docker') {
                    sh 'docker compose build'
                }
            }
        }
        stage('Deploy') {
            steps {
                dir('docker') {
                    sh 'docker compose up -d'
                }
            }
        }
        stage('Verify') {
            steps {
                dir('docker') {
                    sh 'docker compose ps'
                }
            }
        }
    }
    post {
        success {
            echo 'Deployed! TaskFlow is live on port 8090.'
        }
        failure {
            echo 'Pipeline failed - check the logs above.'
        }
    }
}
