package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/markbates/goth/gothic"
)

const (
	script = `<!DOCTYPE html><html><head><script>
  if (!window.opener) {
		console.log('setting up a fake window.opener')
    window.opener = {
      postMessage: function(action, origin) {
        console.log(action, origin);
      }
    }
  }
  (function(status, provider, result) {
    function recieveMessage(e) {
      console.log("Recieve message:", e);
      // send message to main window with da app
			window.opener.postMessage("authorization:" + provider + ":" + status + ":" + result, "*");
//      window.opener.postMessage(
//        "authorization:" + provider + ":" + status + ":" + result,
//        e.origin
//      );
    }
    window.addEventListener("message", recieveMessage, false);
    // Start handshare with parent
    console.log("Sending message:", provider)
    window.opener.postMessage(
      "authorizing:" + provider,
      "*"
    );
  })("%s", "%s", JSON.stringify(%s))
  </script></head><body></body></html>`
)

type Config struct {
	Host string
}

func buildMux(cfg Config) *mux.Router {
	mux := mux.NewRouter()

	mux.HandleFunc("/", handleRoot)
	mux.HandleFunc("/success", handleSuccess)
	mux.HandleFunc("/refresh", handleRefresh)
	mux.HandleFunc("/callback/{provider}", handleCallbackProvider)
	mux.HandleFunc("/auth/{provider}", handleAuthProvider)
	mux.HandleFunc("/auth", newHandleAuth(cfg.Host))

	return mux
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, "")
}
func handleSuccess(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, "")
}
func handleRefresh(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, "")
}

func handleCallbackProvider(w http.ResponseWriter, r *http.Request) {
	var (
		status string
		result string
	)

	fmt.Println("r.Cookies", r.Cookies())

	for _, cookie := range r.Cookies() {
		fmt.Println("Found a cookie named:", cookie.Name, "value", cookie.Value)
	}

	provider, errProvider := gothic.GetProviderName(r)
	user, errAuth := gothic.CompleteUserAuth(w, r)
	status = "error"
	if errProvider != nil {
		fmt.Printf("provider failed with '%s'\n", errProvider)
		result = fmt.Sprintf("%s", errProvider)
	} else if errAuth != nil {
		fmt.Printf("auth failed with '%s'\n", errAuth)
		result = fmt.Sprintf("%s", errAuth)
	} else {
		fmt.Printf("Logged in as %s user: %s (%s)\n", user.Provider, user.Email, user.AccessToken)
		status = "success"
		result = fmt.Sprintf(`{"token":"%s", "provider":"%s"}`, user.AccessToken, user.Provider)
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf(script, status, provider, result)))
}

func handleAuthProvider(w http.ResponseWriter, r *http.Request) {
	gothic.BeginAuthHandler(w, r)
}

func newHandleAuth(host string) http.HandlerFunc {
	// GET /auth Page  redirecting after provider get param
	return func(res http.ResponseWriter, req *http.Request) {
		url := fmt.Sprintf("https://%s/auth/%s", host, req.FormValue("provider"))
		fmt.Printf("redirect to %s\n", url)
		http.Redirect(res, req, url, http.StatusTemporaryRedirect)
	}
}
