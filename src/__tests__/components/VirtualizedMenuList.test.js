import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import VirtualizedMenuList from '../../components/VirtualizedMenuList';

function createRows(count) {
  return Array.from({ length: count }, (_, index) => (
    <div key={`row-${index}`}>Row {index}</div>
  ));
}

describe('VirtualizedMenuList', () => {
  it('scrolls to section target index when section chip is clicked', () => {
    const ref = React.createRef();
    render(
      <VirtualizedMenuList
        ref={ref}
        maxHeight={120}
        rowHeight={20}
        overscan={1}
        sectionIndexItems={[
          {
            track: 'Bahrain',
            trackLabel: 'Bahrain',
            countryCode: 'BH',
            index: 10,
          },
        ]}
      >
        {createRows(30)}
      </VirtualizedMenuList>
    );

    fireEvent.click(screen.getByRole('button', { name: /bahrain/i }));
    expect(ref.current.scrollTop).toBe(200);
  });

  it('emits updated class filter keys when class filter button is toggled', () => {
    const handleClassFilterChange = jest.fn();

    render(
      <VirtualizedMenuList
        maxHeight={120}
        rowHeight={20}
        overscan={1}
        classFilterItems={[
          { key: 'hy', label: 'hy', checked: true },
          { key: 'lmgt3', label: 'lmgt3', checked: true },
        ]}
        onClassFilterChange={handleClassFilterChange}
      >
        {createRows(5)}
      </VirtualizedMenuList>
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(handleClassFilterChange).toHaveBeenCalledWith(['lmgt3']);
  });
});
