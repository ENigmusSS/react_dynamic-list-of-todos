/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [shownTodos, setShownTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [modalTodo, setModalTodo] = useState<Todo>();
  const todosFromServer = React.useRef<Todo[]>([]);

  const openModal = (todo: Todo) => {
    setModalTodo(todo);
    setIsModalShown(true);
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos().then(todos => {
      todosFromServer.current = todos;
      setShownTodos(todosFromServer.current);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                todosToFilter={todosFromServer.current}
                applyFilters={todos => setShownTodos(todos)}
              />
            </div>

            <div className="block">
              {isLoading && <Loader />}
              <TodoList todos={shownTodos} onTodoSelect={openModal} />
            </div>
          </div>
        </div>
      </div>

      {isModalShown && (
        <TodoModal
          todo={modalTodo as Todo}
          onModalClose={() => setIsModalShown(false)}
          key={`modal${modalTodo?.id}`}
        />
      )}
    </>
  );
};
