import qs from "qs";
import axiosClient from "./axiosClient";

const BlogAPI = {
    getAll(params) {
        const url = '/getList';
        return axiosClient.get(url, { params });
    },

    get(id) {
        const url = `/getBlog/${id}`;
        return axiosClient.get(url);
    },

    add(data) {
        const url = '/Create';
        return axiosClient.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    
    update(data) {
        const url = `/Update`;
        return axiosClient.patch(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },

    delete(id) {
        const url = `/Delete/${id}`;
        return axiosClient.delete(url);
    },

    getListLocation() {
        const url = '/getListLocation';
        return axiosClient.get(url);
    },

    getListType() {
        const url = '/getListType';
        return axiosClient.get(url);
    }
};

export default BlogAPI;
