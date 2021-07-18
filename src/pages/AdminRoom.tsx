// import { useState, FormEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button/index'
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode/index'
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
// import { database } from '../services/firebase';

import '../styles/room.scss'
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que voce deseja excluir esta pergunta?")){
      const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button 
              isOutline
              onClick={() => handleEndRoom()}
              >Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>

          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}

        </div>

        <div className="question-list">
          {questions.map(question => {

            console.log(question);
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  >
                  

                  <img src={deleteImg} alt="Deletar pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}