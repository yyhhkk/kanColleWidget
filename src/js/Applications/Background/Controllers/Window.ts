/**
 * Window.ts
 * このファイルで定義されるコントローラ群は、
 * ゲーム窓の作成、ダッシュボード窓の作成、
 * それぞれの位置の記憶など、
 * backgroundからの窓の操作などを担います。
 */

import {Client} from "chomex";
import WindowService from "../../../Services/Window";
import Frame from "../Models/Frame";

/**
 * WindowOpen
 * すでにあれば、指定されたフレーム情報にリサイズする.
 * なければ、指定されたフレームか、最後に指定されたフレームにリサイズする.
 */
export async function WindowOpen(message: any) {
  const wins = WindowService.getInstance();
  const id = message.id;
  const frame = Frame.find<Frame>(id) || Frame.latest();
  let tab = await wins.find();
  if (!!tab) {
    tab = await wins.reconfigure(tab, frame);
    return Client.for(chrome.tabs, tab.id).message("/reconfigured", {frame});
  }
  frame.update({selectedAt: Date.now()});
  tab = await wins.create(frame);
  return tab;
}

/**
 * WindowDecoration
 */
export async function WindowDecoration(message: any) {
  const wins = WindowService.getInstance();
  const launched = wins.knows(this.sender.tab.id);
  if (!launched) {
    return launched;
  }
  // クライアント側で resizeBy をする前に zoom を変えておいてあげる必要がある
  await wins.zoom(launched.tab, launched.frame.zoom);
  return launched;
}
