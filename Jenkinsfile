pipeline {
  agent any
  options { timestamps() }

  environment {
    SNYK_TOKEN = credentials('snyk-token')
  }

  stages {
    stage('Build') {
      steps {
        echo '=== Build Stage ==='
        bat 'npm ci'
        bat 'npm run build'
        archiveArtifacts artifacts: 'build/**', fingerprint: true
      }
    }

    stage('Test') {
      steps {
        echo '=== Test Stage ==='
        bat 'npm test'
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
        echo '=== Code Quality Stage (SonarCloud) ==='
        withSonarQubeEnv('Sonar') {
          bat "\"%SCANNER_HOME%\\bin\\sonar-scanner.bat\""
        }
      }
    }

    stage('Security') {
  steps {
    echo '=== Security Stage (Snyk) ==='
    withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
// Use global Snyk CLI installed on the Jenkins agent
      bat "snyk auth %SNYK_TOKEN%"
      bat "if not exist reports mkdir reports"
      bat "snyk test --json > reports\\snyk.json || exit 0"
      archiveArtifacts artifacts: 'reports/snyk.json', onlyIfSuccessful: false
      }
    }
  }

}

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}
