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
import edit from "../../assets/Edit.png";
import DoneIcon from "@mui/icons-material/Done";

export default function EditInfo() {
  const [open, setOpen] = useState(false);
  const { loggedIn } = useLogin();

  // 각 항목에 대한 상태 관리
  const [nickname, setNickname] = useState(loggedIn);
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("****");

  // 수정 모드 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // 탈퇴 모달 핸들러
  const handleClick = () => {
    setOpen(true);
  };
  const handleLeave = () => {
    // 탈퇴 처리 로직
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // 수정 핸들러
  const handleNicknameEdit = () => {
    setIsEditingNickname(true);
  };
  const handleEmailEdit = () => {
    setIsEditingEmail(true);
  };
  const handlePwEdit = () => {
    setIsEditingPassword(true);
  };

  // 완료 핸들러
  const handleNicknameSave = () => {
    setIsEditingNickname(false);
  };
  const handleEmailSave = () => {
    setIsEditingEmail(false);
  };
  const handlePwSave = () => {
    setIsEditingPassword(false);
  };

  return (
    <div className="w-2/3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-center ml-6 w-32">
          <div className="rounded-full w-24 h-24 bg-red-400 text-white flex items-center justify-center">
            {loggedIn}
          </div>
          <div className="flex flex-row items-center justify-center ">
            {isEditingNickname ? (
              <div className="w-28 flex flex-row my-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="border border-gray-300 rounded py-1 h-6 w-24"
                />
                <DoneIcon
                  onClick={handleNicknameSave}
                  sx={{ marginLeft: "2px" }}
                />
              </div>
            ) : (
              <div className="font-bold m-3 flex flex-row items-center ">
                <div className="w-28 h-fit overflow-auto">{nickname}</div>
                <img
                  src={edit}
                  className="h-4 ml-2 cursor-pointer"
                  onClick={handleNicknameEdit}
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex flex-row justify-between my-3">
            <div>이메일 주소</div>
            <div className="flex flex-row items-center">
              {isEditingEmail ? (
                <div className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 h-6"
                  />

                  <DoneIcon
                    onClick={handleEmailSave}
                    sx={{ marginLeft: "2px" }}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="font-bold">{email}</div>
                  <img
                    src={edit}
                    className="h-4 ml-2 cursor-pointer"
                    onClick={handleEmailEdit}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between my-3">
            <div>비밀번호</div>
            <div className="flex flex-row items-center">
              {isEditingPassword ? (
                <div className="flex items-center">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 h-6"
                  />
                  <DoneIcon onClick={handlePwSave} sx={{ marginLeft: "2px" }} />
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="font-bold">{password}</div>
                  <img
                    src={edit}
                    className="h-4 ml-2 cursor-pointer"
                    onClick={handlePwEdit}
                  />
                </div>
              )}
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
                  정말로 탈퇴하시겠습니까? Disclo의 ~~~~~~~~~~~~~~~
                </DialogContentText>
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
    </div>
  );
}
