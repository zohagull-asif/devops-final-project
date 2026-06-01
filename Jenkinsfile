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
        stage('Security Scan - Trivy') {
            steps {
                echo 'Scanning images for vulnerabilities...'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress docker-backend:latest'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress docker-frontend:latest'
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
        stage('Security Scan - OWASP ZAP') {
            steps {
                echo 'Running OWASP ZAP baseline scan against the running app...'
                sh 'docker run --rm --network host ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://localhost:8090 -I || true'
            }
        }
        stage('Code Quality - SonarQube') {
            steps {
                echo 'Running SonarQube static analysis...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh 'docker run --rm --network host -v $(pwd):/usr/src sonarsource/sonar-scanner-cli -Dsonar.projectKey=taskflow -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$SONAR_TOKEN -Dsonar.working.directory=/tmp/.scannerwork || true'
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