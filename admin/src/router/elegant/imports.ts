/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteComponent } from "vue-router";
import type { LastLevelRouteKey, RouteLayout } from "@elegant-router/types";

import BaseLayout from "@/layouts/baseLayout/index.vue";
import BlankLayout from "@/layouts/blankLayout/index.vue";

export const layouts: Record<RouteLayout, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
};

export const views: Record<LastLevelRouteKey, RouteComponent | (() => Promise<RouteComponent>)> = {
  403: () => import("@/views/_builtin/403/index.vue"),
  404: () => import("@/views/_builtin/404/index.vue"),
  500: () => import("@/views/_builtin/500/index.vue"),
  login: () => import("@/views/_builtin/login/index.vue"),
  home: () => import("@/views/home/index.vue"),
  roles: () => import("@/views/roles/index.vue"),
};