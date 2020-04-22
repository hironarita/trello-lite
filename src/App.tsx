import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Column } from './components/Column';
import { CardModel } from './models/Card';
import { ColumnModel } from './models/Column';


function App() {
	const [cards, setCards] = useState<ReadonlyArray<CardModel>>([]);
	const initialColumn = new ColumnModel(Date.now(), '', 0);
	const [columns, setColumns] = useState<ReadonlyArray<ColumnModel>>([initialColumn]);
	const [highlightedColumnId, sethighlightedColumnId] = useState(0);

	const setParentCards = (title: string, columnId: number, cardId: number, columnIndex: number) => {
		const card = new CardModel(cardId, title, columnId, columnIndex);
		setCards(cards.concat([card]));
	};

	const moveCard = (oldCardId: number, newCard: CardModel) => {
		const clonedCards = cards.slice();
		clonedCards.splice(newCard.ColumnIndex, 0, newCard);
		const newCards = clonedCards
			.filter(x => x.Id !== oldCardId)
			.map((x, i) => new CardModel(x.Id, x.Title, x.ColumnId, i));
		setCards(newCards);
	};

	const addColumn = () => {
		const clonedColumns = columns.slice();
		const newColumn = new ColumnModel(Date.now(), '', clonedColumns.length);
		clonedColumns.push(newColumn);
		setColumns(clonedColumns);
	};

	const moveColumn = (oldColumnId: number, newColumn: ColumnModel) => {
		const clonedColumns = columns.slice();
		clonedColumns.splice(newColumn.BoardIndex, 0, newColumn);
		const newColumns = clonedColumns
			.filter(x => x.Id !== oldColumnId)
			.map((x, i) => new ColumnModel(Date.now(), x.Title, i));
		setColumns(newColumns);
	};

	return (
		<DndProvider backend={Backend}>
			<div className='trello-container'>
				{columns.map((x, i) => 
					<div key={x.Id}>
						<Column
							columnId={x.Id}
							boardIndex={x.BoardIndex}
							highlightedColumnId={highlightedColumnId}
							cards={cards}
							setHighlightedColumnId={(id) => sethighlightedColumnId(id)}
							setParentCards={(title: string, columnId: number, cardId: number, columnIndex: number) => setParentCards(title, columnId, cardId, columnIndex)}
							moveCard={(oldCardId: number, newCard: CardModel) => moveCard(oldCardId, newCard)}
							moveColumn={(oldColumnId: number, newColumn: ColumnModel) => moveColumn(oldColumnId, newColumn)} />
					</div>				
				)}
				<div>
					<button
						type='button'
						onClick={() => addColumn()}
						className='btn btn-secondary add-column-button'>
						+ Add another list
					</button>
				</div>
			</div>
		</DndProvider>
	);
}

export default App;