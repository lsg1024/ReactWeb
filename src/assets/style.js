import styled from 'styled-components';
import arrow from '../image/arrow_foward.svg';

export const NextTo = styled.div`
    background-image: url(${arrow});
    background-size: contain;
    height: 20px;
    width: 20px;
`;

export const Prev = styled.div`
    transform: rotate(180deg);
    background-image: url(${arrow});
    background-size: contain;
    height: 20px;
    width: 20px;
`;