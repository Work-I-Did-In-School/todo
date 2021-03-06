/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */

import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { Navbar, Button, ButtonGroup } from '@blueprintjs/core';
import Form from './form';
import List from './list';
import Auth from '../auth/auth';

import { SettingsContext } from '../../context/settings';

import useForm from '../../hooks/form';

const ToDo = () => {
  const [list, setList] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState([]);
  const { handleChange, handleSubmit } = useForm(addItem);

  const { pageNumber, showComplete } = useContext(SettingsContext);

  function addItem(item) {
    item.id = uuid();
    item.complete = false;
    setList([...list, item]);
  }

  // function deleteItem(id) {
  //   const items = list.filter((item) => item.id !== id);
  //   setList(items);
  // }

  function toggleComplete(id) {
    const items = list.map((item) => {
      if (item.id === id) {
        item.complete = !item.complete;
      }
      return item;
    });

    setList(items);
  }

  useEffect(() => {
    const incompleteCount = list.filter((item) => !item.complete).length;
    setIncomplete(incompleteCount);
    document.title = `To Do List: ${incomplete}`;
  }, [list]);

  useEffect(() => {
    let beginning = 0;
    let end = pageNumber;
    const segments = [];
    if (list.length >= pageNumber) {
      while (list.length > beginning) {
        const page = list.slice(beginning, end);
        segments.push(page);

        beginning += pageNumber;
        end += pageNumber;
      }
      setPages([...segments]);
      setActivePage([...segments[0]]);
    }
  }, [list]);

  useEffect(() => {
    if (!showComplete) {
      const pendingItems = list.filter((item) => item.complete === false);
      setList([...pendingItems]);
    }
  }, [showComplete]);

  return (
    <>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading> To Do </Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home" text="Home" />
          <Button className="bp3-minimal" icon="document" text="Files" />
        </Navbar.Group>
      </Navbar>
      <div id="content-wrapper">
        <Auth capability="create">
          <Form handleChange={handleChange} handleSubmit={handleSubmit} />
        </Auth>
        <Auth capability="read">
          <List
            list={list.length >= pageNumber ? activePage : list}
            toggleComplete={toggleComplete}
          />
        </Auth>
      </div>
      { pages.length
        && (
          <ButtonGroup>
            { pages.map((page, idx) => (
              <Button
                key={pages.indexOf(page)}
                onClick={() => setActivePage(pages[idx])}
              >
                {pages.indexOf(page) + 1}
              </Button>
            ))}
          </ButtonGroup>
        )}
    </>
  );
};

export default ToDo;
