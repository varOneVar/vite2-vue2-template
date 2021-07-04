/*
 * @Author: Song Qing
 * @Date: 2021-04-25 18:04:39
 * @LastEditTime: 2021-04-26 17:04:07
 * @LastEditor: Song Qing
 * @Description: 页面相关接口
 * @FilePath: \app-test\src\api\jobs\pages.js
 */
import { __get } from '@/api/base/api-interceptor'

const prefix = '/mock-server/article'
export const apiArticleList = (args) => __get(`${prefix}/list`, args)
export const apiArticleDetail = (args) => __get(`${prefix}/detail`, args)
