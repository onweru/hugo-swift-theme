// global variables
const hidden = "hidden";
const active = "active";

const doc = document.documentElement;
const parentURL = window.location.protocol + "//" + window.location.host + "/";
const staticman = Object.create(null);
{{ with .Site.Params.staticman -}}
  {{ $staticmanLink := "https://staticman3.herokuapp.com" }}
  const endpoint = "{{ default $staticmanLink .endpoint  }}";
  const gitProvider = "{{ .gitprovider }}";
  const username = "{{ .username }}";
  const repository = "{{ .repository }}";
  const branch = "{{ .branch }}";

  // store reCAPTCHA v2 site key and secret
  {{ with .recaptcha -}}
    staticman.siteKey = "{{ .sitekey }}";
    staticman.secret = "{{ .secret }}";
  {{ end -}}
{{ end -}}

const translations = {
  success: {
    title: '{{ T "successTitle" }}',
    text: '{{ T "successMsg" }}',
    close: '{{ T "close" }}'
  },
  error: {
    title: '{{ T "errTitle" }}',
    text: '{{ T "errMsg" }}',
    close: '{{ T "close" }}'
  },
  discard: {
    title: '{{ T "discardComment" }}',
    button: '{{ T "discard" }}'
  },
  submit: '{{ T "btnSubmit" }}',
  submitted: '{{ T "btnSubmitted" }}'
};

const tAddress = '{{ T "address" }}';
