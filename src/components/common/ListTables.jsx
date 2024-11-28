/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import "../css/ListTables.css"; // 추가된 CSS 파일
import FavoriteIcon from "@mui/icons-material/Favorite"; //빨간 하트
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; //빈 하트
import { useNavigate } from "react-router-dom";
import { useDarkmode } from "../../hooks/useDarkmode";

const StyledTableCell = styled(TableCell)(({ dark }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: dark ? "#292929" : "white",
    color: dark ? "#fafafb" : "black",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ListTables({ type, data, headers }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const { handleDarkMode, dark } = useDarkmode();
  const itemsPerPage = 10;

  const handleFavoriteToggle = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id], // 고유 id의 상태를 토글
    }));
  };

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();
  const handleNavigate = (id) => {
    if (!type) {
      console.error("Error: 'type' is undefined.");
      return;
    }
    navigate(`/${type}/${id}`);
  };
  return (
    <div className="list-container">
      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          className="list-table"
        >
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <StyledTableCell
                  key={header.key}
                  style={{ width: header.width }} // 열 너비를 동적으로 적용
                  align="center"
                >
                  {header.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row) => (
              <StyledTableRow
                key={row.id}
                onClick={() => {
                  handleNavigate(row.id);
                }}
              >
                {headers.map((header, i) => (
                  <StyledTableCell key={i} align="center">
                    {header.key === "num" ? (
                      <div className="heart-number">
                        <span
                          className="heart"
                          onClick={(e) => {
                            handleFavoriteToggle(row.id);
                            e.stopPropagation();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {favorites[row.id] ? (
                            <FavoriteIcon style={{ color: "#F04452" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </span>
                        <span className="number">{row[header.key]}</span>
                      </div>
                    ) : header.key === "votes" ? (
                      <div className="votes-container">
                        <span className="votes-good">
                          호재 {row.votes.good}
                        </span>{" "}
                        |<span className="votes-bad">악재 {row.votes.bad}</span>
                      </div>
                    ) : (
                      row[header.key]
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      {/* <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div> */}
    </div>
  );
}
