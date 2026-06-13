pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                sh 'pwd'
                sh 'ls'
            }
        }

        stage('Test') {
            steps {
                sh 'whoami'
                sh 'date'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy Stage Executed'
            }
        }
    }

    post {
        always {
            echo 'Pipeline Finished'
        }
    }
}
