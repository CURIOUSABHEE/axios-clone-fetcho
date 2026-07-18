
function mergeConfig(defaults = {}, config = {}) {
    return {
        ...defaults,
        ...config,
        headers: {
        ...(defaults.headers || {}),
        ...(config.headers || {}),
        },
    };
}

class InterceptorManager {
    constructor() {
        this.handlers = [];
    }

    use(success, fail) {
        this.handlers.push({
            success,
            fail,
        });

        return this.handlers.length - 1;
    }

    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }

    clear() {
        this.handlers = [];
    }
}


class Fetcho {
    constructor(config = {}) {
        this.defaults = mergeConfig(
        {
            timeout: 1000,
            headers: {
                "Content-Type": "application/json",
            },
        },
        config
        );

        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        };
    }
 
    request(url, config = {}) {
        const request = {
            url,
            config: mergeConfig(this.defaults, config),
        };

        let promise = Promise.resolve(request);

        const chain = [
            ...this.interceptors.request.handlers,
            {
                success: this.dispatchRequest.bind(this),
            },
            ...this.interceptors.response.handlers,
        ];

        for (const handler of chain) {
            if (!handler) continue;

            promise = promise.then(
                handler.success,
                handler.fail
            );
        }

        return promise;
    }

    async dispatchRequest({ url, config }) {
        const controller = new AbortController();

        let timer = null;

        if (config.timeout) {
            timer = setTimeout(() => {
                controller.abort();
            }, config.timeout);
        }

        try {
            const response = await fetch(
                `${config.baseURL || ""}${url}`,
                {
                ...config,
                signal: controller.signal,
                }
            );

            if (!response.ok) {
                throw new Error(
                `HTTP Error ${response.status}`
                );
            }

            return response;
        } finally {
            if (timer) clearTimeout(timer);
        }
    }

    get(url, config = {}) {
        return this.request(url, {
            ...config,
            method: "GET",
        });
    }

    delete(url, config = {}) {
        return this.request(url, {
            ...config,
            method: "DELETE",
        });
    }

    post(url, data, config = {}) {
        return this.request(url, {
            ...config,
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    put(url, data, config = {}) {
        return this.request(url, {
            ...config,
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    patch(url, data, config = {}) {
        return this.request(url, {
            ...config,
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }
}


function create(config) {
    return new Fetcho(config);
}

export default {
  create,
};