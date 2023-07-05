import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";

export const Table = styled.table`
    width: 100%;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px;
    max-width: 800px;
    margin: 20px auto;
    word-break: break-all;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
    text-align: start;
    border-bottom: groove;
    padding-bottom: 5px;
`;

export const Td = styled.td`
    padding-top: 15px;
    border-bottom: inset;
    text-align: ${(props) => (props.alignCenter ? "center" : "start")};
    width: ${(props) => (props.width ? props.width : "auto")};

    @media (max-width: 768px) {
        text-align: center;
        width: auto;
        font-size: 14px;
        white-space: normal;
        word-break: break-word;
    }
`;

export const EditIcon = styled(FaEdit)`
    cursor: pointer;
`;

export const DeleteIcon = styled(FaTrash)`
    cursor: pointer;
`;
