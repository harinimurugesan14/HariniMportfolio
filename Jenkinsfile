pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building Portfolio Website'
                sh 'ls'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing Portfolio Website'
                sh 'pwd'
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