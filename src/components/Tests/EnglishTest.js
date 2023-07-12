import React, { useState, useRef, useEffect } from 'react';
import { A2,B1,B2 } from './TestData/englishTest';
import styles from './test.module.css';

function EnglishTest({setIsOpen}) {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [resultDiv, setResultDiv] = useState(false);
  const [submitDiv,setSubmitDiv] = useState(true)
  const [count, setCount] = useState(0);
  const levels = [A2,B1,B2]
  const levelsString = ['A2','B1','B2']
  const [levelNumber,setLevelNumber] = useState(0)

  const resultsRef = useRef(null);
  const nextLevelRef = useRef(null);
  const newPage = useRef(null)



  useEffect(()=>{
    resultDiv && nextLevelRef && nextLevelRef.current.scrollIntoView({ behavior: 'smooth' });
  },[resultDiv])

  const handleAnswerSelection = (questionIndex, answerIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const submitResults = () => {
    setResultDiv(true);
    setSubmitDiv(false)

    selectedAnswers.map((answer, index) => {
      if (levels[levelNumber][index].answers[answer] === levels[levelNumber][index].correctAnswer) {
        setCount((count) => count + 1);
           } else {
        setWrongAnswers((wrongAnswers) => [...wrongAnswers, index]);
           }
           return null;
    });

    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });

  
  
  };
  const nextLevel = () => {
    setResultDiv(false)
    setCount(0)
    setSelectedAnswers(Array(10).fill(null))
    setWrongAnswers([])
    newPage.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setLevelNumber(prevLevel=>prevLevel+1)
    setSubmitDiv(true)

}

  return (
    <div className={styles.testMainDiv} ref={newPage} >
      <div className={styles.title}>
        <h2>English Test</h2>
      </div>

      <div className={styles.questions}>
        {levels[levelNumber].map((question, questionIndex) => (
          <div key={questionIndex}>
            <div
              className={`${styles.questionsLoop} ${
                resultDiv && wrongAnswers.includes(questionIndex) ? styles.answersLoopWrong : ''
              }`}
            >
              <h2 className={styles.questionsLoopH2}>
                {questionIndex + 1}. {question.question}
              </h2>
            </div>
            {question.answers.map((answer, answerIndex) => (
              <div className={styles.answersLoop} key={answerIndex}>
                <input
                  type="radio"
                  name={`question-${questionIndex}`}
                  checked={selectedAnswers[questionIndex] === answerIndex}
                  onChange={() => handleAnswerSelection(questionIndex, answerIndex)}
                />
                <span className={`${styles.answersLoopH2} ${
                 resultDiv && wrongAnswers.includes(questionIndex) &&   question.correctAnswer === answer  ? styles.answersLoopH2wrong : ''}`}>
                    {answer}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {submitDiv ?
      <div className={styles.submitButton} onClick={submitResults}>
        Submit
      </div>
      :
      '' }

      <div className={styles.results} ref={resultsRef} >
          {resultDiv ? (<>
          <h2 className={styles.resultsH2} > You answered {count} correctly out of {levels[levelNumber].length}</h2>
          {count >= 6 ? 
          <>
          <div >You passed level {levelsString[levelNumber]} 
          {levelNumber < 2 ? 
          <div className={styles.submitButton}  ref={nextLevelRef} onClick={nextLevel} >
                Test Level {levelsString[levelNumber+1]}
            </div>
            :
            <div className={styles.congratulationButton}  ref={nextLevelRef} onClick={()=>{setIsOpen(false)}} >
            Congratulations/go back 
        </div>
          }
          </div>
      

            </>

            :
            <div ref={nextLevelRef} >
            <h2>You did not pass level {levelsString[levelNumber]} </h2>
            <div className={styles.notPassedButton}  ref={nextLevelRef} onClick={()=>{setIsOpen(false)}} >
              Leave the Test 
            </div>
            </div>
        }
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default EnglishTest;