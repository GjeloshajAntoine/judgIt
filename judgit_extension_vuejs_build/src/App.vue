<template>
  <div>
    <div class="popup-container" id="view-root">
      <p class="title" id="title">Container.is-centered</p>
      <p id="url">Good morning. Thou hast had a good night's sleep, I hope.</p>
      <div id="new-entry">
        <input
          type="text"
          v-bind:data-color="input.color"
          id="votetext"
          class="nes-input"
          placeholder="........"
          v-model="input.text"
        />
        <span class="colors-picker">
          <div
            type="button"
            data-color="green"
            v-on:click="switchColor"
            class="cbt green"
            v-bind:class="{ selected: input.color == 'green' }"
          >
            .
          </div>
          <div
            type="button"
            data-color="yellow"
            v-on:click="switchColor"
            class="cbt yellow"
            v-bind:class="{ selected: input.color == 'yellow' }"
          >
            .
          </div>
          <div
            type="button"
            data-color="red"
            v-on:click="switchColor"
            class="cbt red"
            v-bind:class="{ selected: input.color == 'red' }"
          >
            .
          </div>
          <div v-on:click="sendVote" class="bt-addnew">+1</div>
        </span>
      </div>
      <div id="colors-list">
        <div v-for="vote of colorVotes" :key="vote" class="color-line">
          <div
            style="float: left;"
            v-on:click="upVote"
            class="plus-one"
            v-bind:data-text-id="vote.text_id"
            v-bind:data-color="vote.color"
            v-bind:data-is-upvoted="vote.is_upvoted_by_current_user"
            v-bind:class="{ selected: vote.is_upvoted_by_current_user }"
          >
            {{ vote.is_upvoted_by_current_user ? "-1" : "+1" }}
          </div>
          <div class="color-bar" v-bind:data-color="vote.color">
            <span v-bind:data-color="vote.color" class="color-bar-text">{{
              vote.text
            }}</span>
            <div class="color-bar-percentage" v-bind:data-color="vote.color">
              {{ vote.percentage }}%
            </div>
            <div
              class="color-bar-filling"
              v-bind:style="{ width: vote.percentage + '%' }"
              v-bind:data-color="vote.color"
            ></div>
          </div>
        </div>
      </div>
      <div style="text-align: center;color: #80808061;"class="title"v-if="colorVotes.length == 0">
        nothing yet
      </div>
    </div>
  </div>
</template>

<script>
import { NewFapi, jsonPostBody } from "./fapi";
const chrome = window.chrome
let currentTab = new Promise((resolve, reject) =>chrome.tabs.query({ active: true, currentWindow: true }, resolve));
const urlProm = currentTab.then(tabs => {
  document.querySelector("#title").innerText = tabs[0].title;
  document.getElementById("url").innerText = tabs[0].url;
  return tabs[0].url;
});

const fapi = NewFapi(chrome.runtime.getManifest().endPoint);
fapi("/users/token")
  .then(res => res.json())
  .then(data => console.log("user token msg :", data));
let linkIdProm = urlProm
  .then(url => fapi("/votes/linkId", jsonPostBody({ url, url })))
  .then(resp => resp.json())
  .then(data => data.id);

export default {
  name: "app",
  data: () => ({
    input: {
      color: "yellow",
      text: ""
    },
    colorVotes: []
  }),
  created:async function () {
    await linkIdProm ? fapi('/votes/votes',jsonPostBody({linkId:await linkIdProm})).then(res=>res.json())
    .then(data=>this.colorVotes=data) 
    : ''
  },
  methods: {
    switchColor: function(event) {
      this.input.color = event.target.dataset.color;
    },
    sendVote: async function(event) {
      let text = this.input.text;
      let color = this.input.color;
      let linkId = await linkIdProm;
      //console.warn(linkId);
      if (!text) return false;

      (linkId
        ? fapi(
            "/votes/CreateOrUpVoteLinkId",
            jsonPostBody({ linkId: linkId, text: text, color: color })
          )
        : fapi(
            "/votes/CreateOrUpVoteLinkUrl",
            jsonPostBody({ url: await urlProm, text: text, color: color })
          )
      )
        .then(async o => {
          if (await linkIdProm) {
            return linkIdProm;
          } else {
            linkIdProm = fapi(
              "/votes/linkId",
              jsonPostBody({ url: await urlProm })
            )
              .then(resp => resp.json())
              .then(data => data.id);
            return linkIdProm;
          }
        })
        .then(async o =>
          fapi("/votes/votes", jsonPostBody({ linkId: await linkIdProm }))
        )
        .then(res => res.json())
        .then(votes => {
          this.colorVotes = votes;
          this.input.text = "";
        });
    },
    upVote: async function(event) {
      let textId = event.target.dataset.textId;
      let color = event.target.dataset.color;
      let isUpvoted = parseInt(event.target.dataset.isUpvoted);

      let upOrUnVote = isUpvoted ? "/votes/unVote" : "/votes/upVote";

      fapi(
        upOrUnVote,
        jsonPostBody({ textId: textId, linkId: await linkIdProm, color: color })
      )
        .then(resp => resp.json())
        .then(async o =>
          fapi("/votes/votes", jsonPostBody({ linkId: await linkIdProm }))
        )
        .then(resp => resp.json())
        .then(votes => (this.colorVotes = votes));
    }
  }
};
</script>

<style>
@import "./popup.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
