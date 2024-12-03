/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
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
import {
  addFavoriteAnnouncementAPI,
  removeFavoriteAnnouncementAPI,
  addFavoriteStockAPI,
  removeFavoriteStockAPI,
} from "../../services/stockAPI";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "white",
    color: "black",
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
  const [favorites, setFavorites] = useState([]);
  // const { handleDarkMode, dark } = useDarkmode();
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // 로컬 스토리지에서 초기화
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem(
        type === "disclosure" ? "favoriteAnnouncementIds" : "favoriteStockIds"
      ) || "[]"
    );
    setFavorites(storedFavorites);
  }, [type]);

  // 상태가 변경되면 로컬 스토리지에 동기화
  // useEffect(() => {
  //   const key =
  //     type === "disclosure" ? "favoriteAnnouncementIds" : "favoriteStockIds";
  //   localStorage.setItem(key, JSON.stringify(favorites));
  // }, [favorites, type]);

  const handleFavoriteToggle = async (id) => {
    try {
      if (favorites.includes(id)) {
        if (type === "disclosure") {
          await removeFavoriteAnnouncementAPI(id);
        } else {
          await removeFavoriteStockAPI(id);
        }
        setFavorites((prev) => prev.filter((favId) => favId !== id));
      } else {
        if (type === "disclosure") {
          await addFavoriteAnnouncementAPI(id);
        } else {
          await addFavoriteStockAPI(id);
        }
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNavigate = (id) => {
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
                onClick={() => handleNavigate(row.id)} // 행 클릭 시 이동
                style={{ cursor: "pointer" }}
              >
                {headers.map((header, i) => (
                  <StyledTableCell key={i} align="center">
                    {header.key === "id" ? (
                      <div className="heart-number">
                        <span
                          className="heart"
                          onClick={(e) => {
                            e.stopPropagation(); // 좋아요 클릭 시 행 이동 이벤트 중단
                            handleFavoriteToggle(row.id);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {favorites.includes(row.id) ? (
                            <FavoriteIcon style={{ color: "#F04452" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </span>
                        <span className="number">{row[header.key]}</span>
                      </div>
                    ) : header.key === "report" &&
                      row[header.key].slice(0, 6) === "[기재정정]" ? (
                      <div>
                        {" "}
                        <span className="text-primary-4">[기재정정]</span>{" "}
                        <span>{row[header.key].slice(6)}</span>
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
