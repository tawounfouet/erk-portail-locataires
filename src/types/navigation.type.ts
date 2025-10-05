import React from "react";

export interface INavSectionProps
{
  currPage : string;
  setCurrPage: React.Dispatch<React.SetStateAction<string>>;
}


export interface INavState
{
  title: string; // Current page title
}