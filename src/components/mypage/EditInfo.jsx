import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useLogin } from "../../hooks/useLogin";
import edit from "/img/edit.png";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACK_URL;

export default function EditInfo() {
  const [open, setOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const { profileColor, email, nickname, setNickname, resetLoginState } =
    useLogin();
  const navigate = useNavigate();

  // 각 항목에 대한 상태 관리
  const [userInputNickname, setUserInputNickname] = useState(nickname);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [leavePassword, setLeavePassword] = useState("");

  // 수정 모드 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 탈퇴 모달 핸들러
  const handleClick = () => {
    setOpen(true);
  };
  const handleLeave = async () => {
    try {
      const response = await axios.delete(BASE_URL + "/api/user", {
        data: {
          password: leavePassword, // 요청 본문에 password 포함
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("회원 탈퇴 성공");
        resetLoginState();
        setOpen(false);

        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error("필수 필드 누락: " + data.error);
        } else if (status === 401) {
          toast.error("비밀번호가 일치하지 않습니다: " + data.error);
        } else if (status === 404) {
          toast.error("유효하지 않은 email: " + data.error);
        } else if (status === 409) {
          toast.error("Conflict: " + data.error);
        } else {
          toast.error("알 수 없는 오류가 발생했습니다.");
        }
      } else {
        toast.error("서버와의 통신에 실패했습니다.");
      }
    } finally {
      setOpen(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  // 비밀번호 변경 모달 핸들러
  const handlePwModalOpen = () => {
    setPwModalOpen(true);
  };
  const handlePwModalClose = () => {
    setPwModalOpen(false);
  };

  // 수정 핸들러
  const handleNicknameSave = async () => {
    try {
      const response = await axios.patch(
        BASE_URL + "/api/user",
        {
          nickname: userInputNickname,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("닉네임 수정 성공");
        setIsEditingNickname(false);
        setNickname(userInputNickname);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error("제대로된 값을 입력해주세요.");
        } else if (status === 401 || status === 404) {
          toast.error("재로그인 후 다시 시도해주세요.");
        } else if (status === 409) {
          toast.error("중복된 닉네임입니다.");
        } else {
          toast.error("알 수 없는 오류가 발생했습니다.");
        }
      } else {
        toast.error("서버와의 통신에 실패했습니다.");
      }
    }
  };

  const handlePwSave = async () => {
    try {
      const response = await axios.patch(
        BASE_URL + "/api/user/password",
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("비밀번호 변경 성공");
        setPwModalOpen(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error("필수 필드 누락");
        } else if (status === 401) {
          toast.error(error.response.data.error);
        } else if (status === 404) {
          toast.error("Not Found");
        } else if (status === 409) {
          toast.error("Conflict");
        } else {
          toast.error("알 수 없는 오류가 발생했습니다.");
        }
      } else {
        toast.error("서버와의 통신에 실패했습니다.");
      }
    }
  };

  const handlePwEdit = () => {
    handlePwModalOpen();
  };

  return (
    <div className="w-2/3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-left w-100">
          <div
            className={
              "rounded-full w-24 h-24 bg-profile-" +
              profileColor +
              " text-4xl text-white flex items-center justify-center"
            }
          >
            {nickname.slice(0, 2)}
          </div>
          <div className="flex flex-row items-center justify-center w-100">
            <div className="w-100 flex flex-row my-3 justify-center ">
              {isEditingNickname ? (
                <input
                  type="text"
                  value={userInputNickname}
                  onChange={(e) => setUserInputNickname(e.target.value)}
                  className="border border-gray-300 rounded py-1 h-fit w-100"
                />
              ) : (
                <div className="font-bold w-100 h-fit">{nickname}</div>
              )}
              <DoneIcon
                onClick={handleNicknameSave}
                sx={{
                  marginLeft: "2px",
                  display: isEditingNickname ? "block" : "none",
                }}
              />
              <img
                src={edit}
                className="h-4 ml-2 cursor-pointer"
                onClick={() => setIsEditingNickname(true)}
                style={{ display: isEditingNickname ? "none" : "block" }}
              />
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex flex-row justify-between my-3">
            <div>이메일 주소</div>
            <div className="flex flex-row items-center">
              <div className="flex items-center">
                <div className="font-bold">{email}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between my-3">
            <div>비밀번호</div>
            <div className="flex flex-row items-center">
              <div className="flex items-center">
                <div className="font-bold">****</div>
                <img
                  src={edit}
                  className="h-4 ml-2 cursor-pointer"
                  onClick={handlePwEdit}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between my-3">
            <div>회원탈퇴</div>
            <button
              className="bg-primary-3 text-white rounded-xl w-12 text-sm font-bold"
              onClick={handleClick}
            >
              탈퇴
            </button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"회원 탈퇴"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  정말로 탈퇴하시겠습니까? 비밀번호를 입력하세요.
                </DialogContentText>
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={leavePassword}
                  onChange={(e) => setLeavePassword(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full my-2"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleLeave}>탈퇴</Button>
                <Button onClick={handleClose} autoFocus>
                  취소
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>

      <Dialog
        open={pwModalOpen}
        onClose={handlePwModalClose}
        aria-labelledby="password-dialog-title"
        aria-describedby="password-dialog-description"
      >
        <DialogTitle id="password-dialog-title">{"비밀번호 변경"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="password-dialog-description">
            현재 비밀번호와 새 비밀번호를 입력하세요.
          </DialogContentText>
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full my-2"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full my-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePwSave}>저장</Button>
          <Button onClick={handlePwModalClose} autoFocus>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
