const request = require("request");
const urls = require("../var/urls");
const _joinurlquery = require("../functions/_joinurlquery");
const _validatetoken = require("./_validatetoken");
const i = require("..");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || !((logins ?? undefined) || (ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));
        logins = (logins && !Array.isArray(logins) ? [logins] : []);
        ids = (ids && !Array.isArray(ids) ? [ids] : []);

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    moderator_id = a.user_id;
                    clientid = a.client_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "users")}${_joinurlquery("login", logins, true)}${_joinurlquery("id", ids, ((logins ?? undefined) ? false : true))}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200)) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = getUsers;