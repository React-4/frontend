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
import "../css/ListTables.css";
import FavoriteIcon from "@mui/icons-material/Favorite"; 
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; 
import { useNavigate } from "react-router-dom";
// import { useDarkmode } from "../../hooks/useDarkmode";

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
  // const { handleDarkMode, dark } = useDarkmode();
  const itemsPerPage = 10;

  const handleFavoriteToggle = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
  };

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();
  const handleNavigate = (id) => {
    console.log("id", id);
    if (!type) {
      console.error("Error: 'type' is undefined.");
      return;
    }
    navigate(`/${type}/${id}`, {
      state: { data: data.filter((d) => d.id === id) },
    });
  };
  return (
    <div className="list-container">
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
                  style={{ width: header.width }} 
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
                    {header.key === "id" ? (
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
                          호재 {row.votes?.good || 0}
                        </span>{" "}
                        |
                        <span className="votes-bad">
                          악재 {row.votes?.bad || 0}
                        </span>
                      </div>
                    ) : header.key === "changeRate" ? (
                      <span
                        className={
                          parseFloat(row[header.key]) > 0
                          ? "change-rate-positive"
                          : parseFloat(row[header.key]) < 0
                          ? "change-rate-negative"
                          : "change-rate-neutral"
                        }
                      >
                        {row[header.key]}
                      </span>
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
    </div>
  );
}
