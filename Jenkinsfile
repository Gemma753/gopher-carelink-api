pipeline {
  agent any
  options { timestamps() }

  environment {
    // store your Snyk token as Jenkins credential ID: snyk-token
    SNYK_TOKEN = credentials('snyk-token')
  }

  stages {
    stage('Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
        archiveArtifacts artifacts: 'build/**', fingerprint: true
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          junit 'reports/junit/junit.xml'
          archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: false
        }
      }
    }

    stage('Code Quality') {
      environment {
        SCANNER_HOME = tool 'SonarScanner'
      }
      steps {
        withSonarQubeEnv('Sonar') {
          sh '${SCANNER_HOME}/bin/sonar-scanner'
        }
      }
    }

    stage('Security') {
  steps {
    sh 'npx snyk auth ${SNYK_TOKEN}'
    sh 'mkdir -p reports && npx snyk test --json > reports/snyk.json || true'
    archiveArtifacts artifacts: 'reports/snyk.json', onlyIfSuccessful: false
  	}
      }
  }
}
