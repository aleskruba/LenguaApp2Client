import React, { useState, useRef } from 'react';
import styles from './scrollerbarcomponent.module.css';

function ScrollerBarComponent() {
  const [expanded, setExpanded] = useState({});
  const contentRefs = {
    contentRef1: useRef(null),
    contentRef2: useRef(null),
    contentRef3: useRef(null),
    contentRef4: useRef(null),
  };

  const expandFunction = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getContentHeight = (ref) => {
    if (ref.current) {
      return ref.current.scrollHeight + 'px';
    }
    return '0px';
  };

  const scrollingTextData = [
    {
      id: '1',
      question: 'How does Lengua work?',
      answer:
        "Lengua helps you achieve your language learning ambitions. Find your ideal teacher and book a 1-on-1 lesson. There's no subscription or rigid schedule. Learn when you want, as much as you want.\n\nIf you'd prefer to learn without a teacher, you can use Lengua's handy learning tools. Improve your vocabulary, train your ear with podcasts, and put your knowledge to the test with quizzes. The Lengua Community is always sharing new content with language lovers.",
    },
    {
      id: '2',
      question: 'How many Lengua lessons a week can I take?',
      answer:
        "We don't want to limit your learning. As long as you and your teacher have the time, you can take as many lessons as you want.\n\nTeachers on Lengua allow you to go at your own pace. If you want to have a quick lesson during your lunch break, 30-minute or 45-minute lessons are ideal. For people looking for a longer session, you can book up to 90 minutes!\n\nWe also offer lessons for impulsive learners. If you want to learn a language right now, you can book an Instant Lesson and start a trial lesson.",
    },
    {
      id: '3',
      question: 'Is Lengua worth it for learning a language?',
      answer:
        'Yes! Lengua offers the freedom and flexibility to learn with a teacher you like, at a price you can afford, with a schedule that works for you.\n\nYou aren\'t locked into any hard commitments. Lessons are pay-as-you-go, and teachers set their own prices. Browse a marketplace of teachers with different teaching styles and curricula until you find the teacher that\'s right for you.\n\nLearning doesn\'t always have to take place in a classroom. Share posts with the Community and receive feedback from other language learners. Use Lengua\'s learning tools to discover new words with vocabulary sets, listen to podcasts from around the world, practice with prompts, and more!',
    },
    {
      id: '4',
      question: 'How do I become a teacher on Lengua?',
      answer:
        'Anyone is welcome to apply to be a teacher on Lengua. You can apply by clicking here.\n\nThere are two types of teachers on Lengua: community tutors and professional teachers. Professional teachers have proven experience teaching and the qualifications required to help you learn a language efficiently.\n\nCommunity tutors are passionate language lovers who want to share their knowledge with others.',
    },
  ];

  return (
    <div className={styles.homeMainDiv}>
      <div className={styles.frequentlyQuestions}>
        <div className={styles.frequentlyQuestionsTitle}>
          <h4 className={styles.h4Master}>Frequently asked questions</h4>
        </div>

        {scrollingTextData.map((data) => (
          <div className={styles.scrollingText} key={data.id}>
            <div className={styles.scrollingTextFirstLine}>
              <div className={styles.scrollingTextFirstLineText}>
              <h5 className={styles.h5Master}>   {data.question} </h5>
              </div>
              <div
                className={`${styles.arrowDiv} ${expanded[data.id] ? styles.rotate : ''
                  }`}
                onClick={() => expandFunction(data.id)}
              >
                &#x2228;
              </div>
            </div>
            <div
              className={`${styles.scrollingTextMainText} ${expanded[data.id] ? styles.expanded : ''
                }`}
              ref={contentRefs[`contentRef${data.id}`]}
              style={{
                maxHeight: expanded[data.id]
                  ? getContentHeight(contentRefs[`contentRef${data.id}`])
                  : '0px',
              }}
            >
              {data.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollerBarComponent;