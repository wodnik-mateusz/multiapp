import React from 'react';
import { shallow } from 'enzyme';
import List from './List';

describe('Filters component', () => {

    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<List />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toEqual(true);
    });
});
