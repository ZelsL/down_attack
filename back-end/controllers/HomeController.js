class HomeController {
  async index(req, res) {
    res.send("BDO OPTIMIZER API");
  }
  async validate(req, res) {
    res.send("OK!");
  }
}

module.exports = new HomeController();
