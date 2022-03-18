import React from 'react';
import ReactDOM from 'react-dom';
import { LoremIpsum } from 'lorem-ipsum';
import Affix from '../index';
import './index.css';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 25,
    min: 10
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const renderDummyList = (n: number, render: (i: number) => JSX.Element) => {
  const items: JSX.Element[] = [];
  for (let i = 0; i < n; i++) items.push(render(i));
  return items;
};

ReactDOM.render(
  <React.StrictMode>
    <>
      <header className="my-navbar w-full h-14">
        <div className="fixed flex items-center bg-neutral-800 text-white w-full h-14 px-5 z-50">
          <p className="m-0">Fixed Navbar</p>
        </div>
      </header>

      <div className="container mx-auto py-5 px-3">

        <div className="border-2 border-neutral-400 border-dashed h-36 rounded mb-5 p-5">
          <p>Banner</p>
        </div>

        <div className="grid grid-cols-12 gap-4">

          <div className="col-span-9">
            <div className="my-content border-2 border-neutral-400 border-dashed rounded mb-5 p-5">
              {renderDummyList(20, key => (
                <p key={key}>{lorem.generateParagraphs(1)}</p>
              ))}
            </div>
          </div>

          <div className="col-span-3">
            <Affix fixedNavbarSelector="header.my-navbar" relativeElementSelector="div.my-content">
              <div className="rounded border-2 border-dashed border-orange-500 p-5 shadow">
                <p>Affix Component</p>
                {renderDummyList(15, key => (
                  <div className="bg-slate-200 h-6 rounded mt-2" key={key} />
                ))}
              </div>
            </Affix>
          </div>
        </div>

        <div className="border-2 border-neutral-400 border-dashed rounded mb-5 p-5" style={{height: '75vh'}}>
          <p>Some Content</p>
        </div>
      </div>
    </>
  </React.StrictMode>,
  document.getElementById('root')
);