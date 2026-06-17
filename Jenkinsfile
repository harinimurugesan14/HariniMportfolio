pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building Portfolio'
                sh 'ls'
            }
        }

        stage('Docker Test') {
            steps {
                sh 'docker --version'
                sh 'docker ps'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy Stage'
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