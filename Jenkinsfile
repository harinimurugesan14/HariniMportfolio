pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building Portfolio Website'
                sh 'ls'
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Portfolio Website'
            }
        }
    }

    post {
        always {
            echo 'Pipeline Finished'
        }

        success {
            echo 'Build Successful'
        }

        failure {
            echo 'Build Failed'
        }
    }
}